#!/usr/bin/env node

import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import Ajv from 'ajv';

const ajv = new Ajv();
const schema = JSON.parse(await readFile('src/governance/CELL_MANIFEST_SCHEMA.json', 'utf-8'));
const validate = ajv.compile(schema);

const cellsDir = 'src/cells';
const manifests = [];

async function findManifests(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await findManifests(fullPath);
    } else if (entry.name === 'cell.manifest.json') {
      manifests.push(fullPath);
    }
  }
}

await findManifests(cellsDir);

console.log('🔍 Validating', manifests.length, 'cell manifests against schema...\n');

let allValid = true;
const results = [];

for (const manifestPath of manifests) {
  try {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf-8'));
    const valid = validate(manifest);
    
    if (!valid) {
      allValid = false;
      console.log(`❌ ${manifestPath}`);
      console.log('   Errors:', validate.errors);
    } else {
      console.log(`✅ ${manifestPath}`);
    }
    
    results.push({
      path: manifestPath,
      valid,
      errors: valid ? null : validate.errors
    });
  } catch (error) {
    allValid = false;
    console.log(`💥 ${manifestPath} - Parse error:`, error.message);
  }
}

console.log('\n📊 SUMMARY:');
console.log(`Total manifests: ${manifests.length}`);
console.log(`Valid: ${results.filter(r => r.valid).length}`);
console.log(`Invalid: ${results.filter(r => !r.valid).length}`);

if (!allValid) {
  console.error('\n🚨 SOME MANIFESTS INVALID - DECREE VIOLATION DETECTED');
  process.exit(1);
} else {
  console.log('\n🎉 ALL MANIFESTS VALID - DECREE COMPLIANCE ACHIEVED');
}
