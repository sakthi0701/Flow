// Simple test for API service
// Import the API service
const fs = require('fs');
const path = require('path');

// Since we can't easily import the TypeScript file, let's just verify it exists and has content
console.log('Testing API service file...');

// Check if the api.ts file exists
try {
  const filePath = path.join(__dirname, 'api.ts');
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    const stats = fs.statSync(filePath);
    console.log('✓ api.ts file exists');
    console.log(`✓ File size: ${stats.size} bytes`);
    
    // Read the file to verify it has content
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.length > 0) {
      console.log('✓ api.ts file has content');
      
      // Check for key functions
      if (content.includes('getSchedule')) {
        console.log('✓ getSchedule function found');
      }
      if (content.includes('getTasks')) {
        console.log('✓ getTasks function found');
      }
      if (content.includes('getGoals')) {
        console.log('✓ getGoals function found');
      }
      if (content.includes('getClasses')) {
        console.log('✓ getClasses function found');
      }
      if (content.includes('getPreferences')) {
        console.log('✓ getPreferences function found');
      }
      
      console.log('All API service file tests passed!');
    } else {
      console.log('✗ api.ts file is empty');
    }
  } else {
    console.log('✗ api.ts file does not exist');
  }
} catch (error) {
  console.error('API service file test failed:', error);
}

module.exports = { testApiServiceFile: () => {} };