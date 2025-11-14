// app/index.tsx
import React from 'react';
// Adjust the path based on your actual project structure
import { HomeScreen } from '../src/screens/HomeScreen';

// This is the default export Expo Router looks for
export default function IndexScreen() {
  // Simply render your original HomeScreen component
  return <HomeScreen />;
}

// You likely don't need navigation/route props passed here anymore
// if HomeScreen doesn't directly use them for navigation logic handled by the layout.
// If it does, you might need to adjust HomeScreen or use Expo Router hooks like useLocalSearchParams.