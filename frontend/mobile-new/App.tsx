import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { HomeScreen } from './src/screens/HomeScreen';
import { FocusScreen } from './src/screens/FocusScreen';
import { CoachScreen } from './src/screens/CoachScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PlannerScreen } from './src/screens/PlannerScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

enableScreens();

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Schedule',
            }}
          />
          <Tab.Screen
            name="Focus"
            component={FocusScreen}
            options={{
              title: 'Focus Mode',
            }}
          />
          <Tab.Screen
            name="Coach"
            component={CoachScreen}
            options={{
              title: 'AI Coach',
            }}
          />
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
              title: 'Dashboard',
            }}
          />
          <Tab.Screen
            name="Planner"
            component={PlannerScreen}
            options={{
              title: 'Academic',
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: 'Settings',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}