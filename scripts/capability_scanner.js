import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CELLS_DIR = path.join(path.resolve(), 'src/cells');

console.log(`\n🔍 [NATT-OS] CAPABILITY SCANNER v1.2 (Deep Scan)`);
console.log(`=================================================`);

if (!fs.existsSync(CELLS_DIR)) {
    console.error(`❌ Error: src/cells not found at ${CELLS_DIR}`);
    process.exit(1);
}

function scanRecursive(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(scanRecursive(filePath));
        } else {
            // Chỉ quét file .ts trong thư mục ports
            if (filePath.includes('/ports/') && filePath.endsWith('.ts')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

function scanCells() {
    // Quét đệ quy tìm tất cả file .ts trong ports
    const portFiles = scanRecursive(CELLS_DIR);
    let totalCaps = 0;

    portFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const cellName = file.split('/src/cells/')[1].split('/')[1]; // Lấy tên cell
        
        // Regex tìm tên method trong interface
        // VD: checkAvailability(req...
        const methodRegex = /([a-z][a-zA-Z0-9]+)\s*\(/g;
        const matches = [...content.matchAll(methodRegex)];
        
        const caps = matches.map(m => m[1])
                            .filter(c => c !== 'constructor' && c !== 'super' && c !== 'if' && c !== 'for' && c !== 'switch');
        
        if (caps.length > 0) {
            console.log(`✅ [${cellName.padEnd(20)}] Detected: ${[...new Set(caps)].join(', ')}`);
            totalCaps += new Set(caps).size;
        }
    });

    console.log(`=================================================`);
    console.log(`🏁 Scan Complete. Total Capabilities: ${totalCaps}`);
}

scanCells();
