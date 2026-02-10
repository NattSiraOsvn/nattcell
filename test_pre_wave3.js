// Test script for NATT-OS Pre-Wave3 Validation
import { readFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testRegistry() {
  console.log('🔍 Testing Registry...');
  try {
    const registry = JSON.parse(await readFile('src/governance/natt-master-registry-v2.json', 'utf-8'));
    console.log(`✅ Registry valid with ${registry.length} cells`);
    
    // Check warehouse-cell quarantine status
    const warehouse = registry.find(cell => cell.id === 'warehouse-cell');
    if (warehouse && warehouse.status === 'QUARANTINED') {
      console.log('✅ Warehouse-cell properly quarantined');
    } else {
      console.log('❌ Warehouse-cell not properly quarantined');
    }
    
    return registry.length;
  } catch (error) {
    console.error('❌ Registry test failed:', error.message);
    return 0;
  }
}

async function testQuarantine() {
  console.log('\n🔍 Testing Quarantine Guard...');
  try {
    // Try to import warehouse-cell
    const { CELL_STATUS } = await import('./src/cells/warehouse-cell/index.js');
    console.log('❌ Quarantine test FAILED: No error thrown');
    return false;
  } catch (error) {
    if (error.message.includes('WAREHOUSE_CELL_QUARANTINED')) {
      console.log('✅ Quarantine test PASSED: Correct error thrown');
      return true;
    } else {
      console.log(`⚠️ Quarantine test UNKNOWN: ${error.message}`);
      return false;
    }
  }
}

async function testStructure() {
  console.log('\n🔍 Testing Cell Structure...');
  try {
    const { stdout } = await execAsync('find src/cells -name "*-cell" -type d | grep -v _legacy | wc -l');
    const cellCount = parseInt(stdout.trim());
    console.log(`✅ Found ${cellCount} cells in structure`);
    return cellCount;
  } catch (error) {
    console.error('❌ Structure test failed:', error.message);
    return 0;
  }
}

async function main() {
  console.log('🚀 NATT-OS PRE-WAVE3 VALIDATION TESTS\n');
  
  const [registryCount, quarantinePassed, structureCount] = await Promise.all([
    testRegistry(),
    testQuarantine(),
    testStructure()
  ]);
  
  console.log('\n📊 TEST SUMMARY:');
  console.log(`- Registry cells: ${registryCount}`);
  console.log(`- Filesystem cells: ${structureCount}`);
  console.log(`- Quarantine working: ${quarantinePassed ? '✅' : '❌'}`);
  
  if (registryCount > 0 && quarantinePassed) {
    console.log('\n🎉 ALL TESTS PASSED - READY FOR WAVE 3!');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED - NEED REVIEW');
  }
}

main().catch(console.error);
