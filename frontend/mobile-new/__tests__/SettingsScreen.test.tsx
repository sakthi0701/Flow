// Simple test file for SettingsScreen
import { SettingsScreen } from '../src/screens/SettingsScreen';

// Basic validation that the component exists
const testSettingsScreen = () => {
  if (!SettingsScreen) {
    throw new Error('SettingsScreen component is not defined');
  }
  return true;
};

export { testSettingsScreen };