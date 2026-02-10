import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CELLS_DIR = path.join(path.resolve(), 'src/cells');

console.log(`\n🔍 [NATT-OS] CAPABILITY SCANNER (Mode: DRY-RUN)`);
console.log(`=================================================`);

if (!fs.existsSync(CELLS_DIR)) {
    console.error(`❌ Error: src/cells not found at ${CELLS_DIR}`);
    process.exit(1);
}

// Hàm quét đệ quy tìm file ports/index.ts
function scanCells() {
    const cells = fs.readdirSync(CELLS_DIR);
    let totalCaps = 0;

    cells.forEach(cell => {
        const cellPath = path.join(CELLS_DIR, cell);
        if (!fs.statSync(cellPath).isDirectory()) return;
        if (cell.startsWith('_')) return; // Bỏ qua _legacy

        const portFile = path.join(cellPath, 'ports', 'index.ts');
        
        if (fs.existsSync(portFile)) {
            const content = fs.readFileSync(portFile, 'utf-8');
            
            // Regex tìm method name hoặc interface props
            // VD: getName(), execute: () => void
            const methodRegex = /([a-z][a-zA-Z0-9]+)\s*[\(:]/g;
            const matches = [...content.matchAll(methodRegex)];
            
            const caps = matches.map(m => m[1])
                                .filter(c => c !== 'constructor' && c !== 'super');
            
            if (caps.length > 0) {
                console.log(`✅ [${cell.padEnd(20)}] Detected: ${caps.join(', ')}`);
                totalCaps += caps.length;
            } else {
                console.log(`ℹ️  [${cell.padEnd(20)}] No capabilities detected yet.`);
            }
        }
    });

    console.log(`=================================================`);
    console.log(`🏁 Scan Complete. Total Potential Capabilities: ${totalCaps}`);
}

scanCells();
