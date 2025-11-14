// Simple test for API service
const { api } = require('../src/services/api');

// Basic tests for API service functions
async function testApiService() {
  console.log('Testing API service...');
  
  try {
    // Test getSchedule
    const schedule = await api.getSchedule('test-user', '2025-10-18');
    console.log('✓ getSchedule works');
    
    // Test getTasks
    const tasks = await api.getTasks('test-user');
    console.log('✓ getTasks works');
    
    // Test getGoals
    const goals = await api.getGoals('test-user');
    console.log('✓ getGoals works');
    
    // Test getClasses
    const classes = await api.getClasses('test-user');
    console.log('✓ getClasses works');
    
    // Test getPreferences
    const preferences = await api.getPreferences('test-user');
    console.log('✓ getPreferences works');
    
    console.log('All API service tests passed!');
    return true;
  } catch (error) {
    console.error('API service test failed:', error);
    return false;
  }
}

// Run the test
testApiService();

module.exports = { testApiService };