// app/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// 1. IMPORT NECESSARY THEME MODULES
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme'; // Your custom colors

// Function to render tab icons (Example using FontAwesome)
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // 2. GET THE CURRENT COLOR SCHEME
  const colorScheme = useColorScheme() ?? 'light';

  // 3. CREATE CUSTOM THEME OBJECTS
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...Colors.light,
    },
  };
  
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...Colors.dark,
    },
  };

  // 4. DETERMINE WHICH THEME TO USE
  const currentTheme = colorScheme === 'dark' ? MyDarkTheme : MyLightTheme;

  return (
    // 5. WRAP THE APP IN THE THEMEPROVIDER
    <ThemeProvider value={currentTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: '#4285f4', // Example active color
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              // Add styling for the tab bar itself if needed
            },
            headerShown: false, // Screens will provide their own headers if needed
          }}
        >
          <Tabs.Screen
            name="index" // Corresponds to app/index.tsx
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
            }}
          />
          <Tabs.Screen
            name="planner" // Corresponds to app/planner.tsx
            options={{
              title: 'Planner',
              tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
            }}
          />
          <Tabs.Screen
            name="focus" // Corresponds to app/focus.tsx
            options={{
              title: 'Focus',
              tabBarIcon: ({ color }) => <TabBarIcon name="clock-o" color={color} />, // Example icon
            }}
          />
          <Tabs.Screen
            name="coach" // Corresponds to app/coach.tsx
            options={{
              title: 'Coach',
              tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />, // Example icon
            }}
          />
          <Tabs.Screen
            name="dashboard" // Corresponds to app/dashboard.tsx
            options={{
              title: 'Dashboard', // Changed from 'More' in image to match your structure
              tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />, // Example icon
            }}
          />
          {/* If you need a 'More' tab linking to Settings, create app/more.tsx */}
          {/* <Tabs.Screen name="more" ... /> */}

        </Tabs>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}