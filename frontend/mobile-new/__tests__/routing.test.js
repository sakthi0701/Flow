// Test to verify all routes are properly set up
const fs = require('fs');
const path = require('path');

console.log('Testing routing setup...');

// Check if all required route files exist
const routeFiles = [
  'app/index.tsx',
  'app/home.tsx',
  'app/focus.tsx',
  'app/coach.tsx',
  'app/dashboard.tsx',
  'app/planner.tsx',
  'app/settings.tsx',
  'app/_layout.tsx'
];

console.log('\n=== Route File Tests ===');
let allRouteFilesExist = true;
for (const file of routeFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} is missing`);
    allRouteFilesExist = false;
  }
}

// Check if index.tsx redirects properly
const indexContent = fs.readFileSync(path.join(__dirname, '..', 'app/index.tsx'), 'utf8');
if (indexContent.includes('Redirect') && indexContent.includes('/home')) {
  console.log('✓ Index route redirects to home');
} else {
  console.log('✗ Index route does not redirect properly');
}

// Check if all screen routes import their components correctly
const screenRoutes = [
  { file: 'home.tsx', component: 'HomeScreen' },
  { file: 'focus.tsx', component: 'FocusScreen' },
  { file: 'coach.tsx', component: 'CoachScreen' },
  { file: 'dashboard.tsx', component: 'DashboardScreen' },
  { file: 'planner.tsx', component: 'PlannerScreen' },
  { file: 'settings.tsx', component: 'SettingsScreen' }
];

console.log('\n=== Screen Route Tests ===');
let allScreenRoutesValid = true;
for (const route of screenRoutes) {
  const content = fs.readFileSync(path.join(__dirname, '..', 'app', route.file), 'utf8');
  if (content.includes(route.component)) {
    console.log(`✓ ${route.file} imports ${route.component}`);
  } else {
    console.log(`✗ ${route.file} does not import ${route.component}`);
    allScreenRoutesValid = false;
  }
}

// Check if _layout.tsx has all tab screens
console.log('\n=== Layout Configuration Tests ===');
const layoutContent = fs.readFileSync(path.join(__dirname, '..', 'app/_layout.tsx'), 'utf8');
const requiredScreens = ['home', 'focus', 'coach', 'dashboard', 'planner', 'settings'];
let allScreensInLayout = true;
for (const screen of requiredScreens) {
  if (layoutContent.includes(`name="${screen}"`) || layoutContent.includes(`name='${screen}'`)) {
    console.log(`✓ ${screen} screen configured in layout`);
  } else {
    console.log(`✗ ${screen} screen missing from layout`);
    allScreensInLayout = false;
  }
}

// Final summary
console.log('\n=== Routing Test Summary ===');
if (allRouteFilesExist && allScreenRoutesValid && allScreensInLayout) {
  console.log('🎉 All routing tests passed! The app navigation is properly configured.');
  console.log('\nRoutes available:');
  console.log('  ✓ /home - Schedule/Home screen');
  console.log('  ✓ /focus - Focus Mode screen');
  console.log('  ✓ /coach - AI Coach screen');
  console.log('  ✓ /dashboard - Dashboard screen');
  console.log('  ✓ /planner - Academic/Planner screen');
  console.log('  ✓ /settings - Settings screen');
} else {
  console.log('❌ Some routing tests failed. Please check the implementation.');
}

module.exports = { testRouting: () => {} };