#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Comprehensive Test Suite...\n');

const runTests = (directory, testType) => {
  console.log(`📁 Running ${testType} tests in ${directory}...`);
  
  try {
    const cwd = path.join(__dirname, directory);
    
    if (directory === 'client') {
      // Run client tests with coverage
      execSync('npm run test:coverage', { 
        cwd, 
        stdio: 'inherit' 
      });
    } else {
      // Run server tests with coverage
      execSync('npm run test:coverage', { 
        cwd, 
        stdio: 'inherit' 
      });
    }
    
    console.log(`✅ ${testType} tests completed successfully\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${testType} tests failed:`, error.message);
    return false;
  }
};

const main = async () => {
  const results = {
    client: false,
    server: false
  };

  // Run client tests
  results.client = runTests('client', 'Client (Vue.js)');
  
  // Run server tests  
  results.server = runTests('server', 'Server (Express.js)');

  // Summary
  console.log('📊 Test Results Summary:');
  console.log('========================');
  console.log(`Client Tests: ${results.client ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Server Tests: ${results.server ? '✅ PASSED' : '❌ FAILED'}`);
  
  const allPassed = results.client && results.server;
  console.log(`\nOverall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('\n🎉 Comprehensive test suite completed successfully!');
    console.log('📈 Coverage reports generated in both client/coverage and server/coverage directories');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the output above for details.');
    process.exit(1);
  }
};

main().catch(console.error);