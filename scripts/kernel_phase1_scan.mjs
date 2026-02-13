import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = process.cwd();
const KERNEL_DIR = path.join(ROOT, "src/cells/kernel");
const LOCK_PATH = path.join(ROOT, "src/governance/kernel.contracts.lock.json");

const FORBIDDEN_IMPORT_SNIPS = [
  "/src/cells/business/",
  "/src/cells/infrastructure/", // kernel should not depend on infra impls
  "/src/cells/platform/",
  "/src/cells/infra/",
];

const ALLOWED_INFRA_CONTRACTS = [
  "/src/cells/infrastructure/shared-contracts-cell/",
  "/src/cells/infrastructure/smartlink-cell/",
];

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function sha256File(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function readTextSafe(filePath) {
  try { return fs.readFileSync(filePath, "utf8"); } catch { return ""; }
}

function isAllowedInfraContract(p) {
  const norm = p.replace(/\\/g, "/");
  return ALLOWED_INFRA_CONTRACTS.some(a => norm.includes(a));
}

function findKernelCells() {
  return fs.readdirSync(KERNEL_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.endsWith("-cell"))
    .map(d => path.join(KERNEL_DIR, d.name))
    .sort();
}

function scanImports(tsFiles) {
  const violations = [];
  const importRe = /from\s+['"]([^'"]+)['"]/g;

  for (const f of tsFiles) {
    const t = readTextSafe(f);
    let m;
    while ((m = importRe.exec(t)) !== null) {
      const spec = m[1];

      // Only enforce relative & alias imports that might cross boundaries.
      if (!spec.startsWith(".") && !spec.startsWith("@/") && !spec.startsWith("src/")) continue;

      // Resolve to a pseudo path for detection
      const pseudo = spec.startsWith("@/") ? spec.replace("@/", "/src/") :
                     spec.startsWith("src/") ? "/" + spec :
                     path.normalize(path.join(path.dirname(f), spec)).replace(ROOT, "");

      const norm = pseudo.replace(/\\/g, "/");

      // Allow shared-contracts + smartlink as infra contracts only
      if (norm.includes("/src/cells/infrastructure/")) {
        if (!isAllowedInfraContract(norm)) {
          violations.push({ file: f.replace(ROOT + path.sep, ""), import: spec, resolved: norm });
        }
        continue;
      }

      // Forbid business imports always
      if (norm.includes("/src/cells/business/")) {
        violations.push({ file: f.replace(ROOT + path.sep, ""), import: spec, resolved: norm });
        continue;
      }

      // Other forbidden roots
      if (FORBIDDEN_IMPORT_SNIPS.some(s => norm.includes(s))) {
        // shared-contracts and smartlink already handled above
        violations.push({ file: f.replace(ROOT + path.sep, ""), import: spec, resolved: norm });
      }
    }
  }
  return violations;
}

function collectPublicSurfaceFiles(cellDir) {
  // "Freeze public ports": focus on ports + contract-ish files (ports, interface public handlers, manifest)
  const candidates = [];
  const portsDir = path.join(cellDir, "ports");
  const ifaceDir = path.join(cellDir, "interface");
  const manifest = path.join(cellDir, "cell.manifest.json");

  if (fs.existsSync(manifest)) candidates.push(manifest);

  if (fs.existsSync(portsDir)) {
    for (const f of walk(portsDir)) if (f.endsWith(".ts")) candidates.push(f);
  }

  // interface can be large; only take controllers/handlers (public ingress)
  if (fs.existsSync(ifaceDir)) {
    for (const f of walk(ifaceDir)) {
      if (f.endsWith(".ts") && (f.includes("controllers") || f.includes("handlers"))) candidates.push(f);
    }
  }

  return candidates.sort();
}

function main() {
  const cells = findKernelCells();

  // Scan imports for violations
  const kernelTs = walk(KERNEL_DIR).filter(f => f.endsWith(".ts"));
  const violations = scanImports(kernelTs);

  // Build lock snapshot (hashes)
  const lock = {
    meta: {
      version: "KERNEL_PHASE1_LOCK_v1",
      generated_at: new Date().toISOString(),
      principle: "FILESYSTEM_GROUND_TRUTH",
      scope: "kernel_public_surface_only",
    },
    kernel_cells: {},
    violations_summary: {
      count: violations.length,
      violations,
    },
  };

  for (const cellDir of cells) {
    const cellName = path.basename(cellDir);
    const files = collectPublicSurfaceFiles(cellDir);

    lock.kernel_cells[cellName] = {
      cell: cellName,
      files: files.map(p => ({
        path: p.replace(ROOT + path.sep, "").replace(/\\/g, "/"),
        sha256: sha256File(p),
      })),
    };
  }

  fs.writeFileSync(LOCK_PATH, JSON.stringify(lock, null, 2) + "\n", "utf8");

  if (violations.length) {
    console.error("❌ KERNEL PHASE1 SCAN: boundary violations found:", violations.length);
    for (const v of violations.slice(0, 50)) {
      console.error(` - ${v.file} imports ${v.import} (${v.resolved})`);
    }
    process.exitCode = 2;
  } else {
    console.log("✅ KERNEL PHASE1 SCAN: no boundary violations");
  }

  console.log("✅ Lockfile written:", path.relative(ROOT, LOCK_PATH));
}

main();
