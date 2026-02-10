// CommonJS test script
const fs = require('fs');
const path = require('path');

function testRegistry() {
  console.log('🔍 Testing Registry...');
  try {
    const registry = JSON.parse(fs.readFileSync('src/governance/natt-master-registry-v2.json', 'utf-8'));
    console.log(`✅ Registry valid with ${registry.length} cells`);
    return registry.length;
  } catch (error) {
    console.error('❌ Registry test failed:', error.message);
    return 0;
  }
}

function testQuarantine() {
  console.log('\n🔍 Testing Quarantine Guard...');
  try {
    // Check if warehouse-cell has quarantine guard
    const guardPath = path.join(__dirname, 'src/cells/warehouse-cell/QUARANTINE_GUARD.ts');
    if (fs.existsSync(guardPath)) {
      console.log('✅ Quarantine guard file exists');
      return true;
    } else {
      console.log('❌ Quarantine guard file missing');
      return false;
    }
  } catch (error) {
    console.error('❌ Quarantine test failed:', error.message);
    return false;
  }
}

function testStructure() {
  console.log('\n🔍 Testing Cell Structure...');
  try {
    const { execSync } = require('child_process');
    const cellCount = parseInt(execSync('find src/cells -name "*-cell" -type d | grep -v _legacy | wc -l').toString().trim());
    console.log(`✅ Found ${cellCount} cells in structure`);
    return cellCount;
  } catch (error) {
    console.error('❌ Structure test failed:', error.message);
    return 0;
  }
}

function main() {
  console.log('🚀 NATT-OS PRE-WAVE3 VALIDATION TESTS\n');
  
  const registryCount = testRegistry();
  const quarantinePassed = testQuarantine();
  const structureCount = testStructure();
  
  console.log('\n📊 TEST SUMMARY:');
  console.log(`- Registry cells: ${registryCount}`);
  console.log(`- Filesystem cells: ${structureCount}`);
  console.log(`- Quarantine guard: ${quarantinePassed ? '✅' : '❌'}`);
  
  if (registryCount > 0 && quarantinePassed) {
    console.log('\n🎉 ALL TESTS PASSED - READY FOR WAVE 3!');
  } else {
    console.log('\n⚠️ SOME TESTS FAILED - NEED REVIEW');
  }
}

main();
