/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#4299f0';
const tintColorDark = '#4299f0';

export const Colors = {
  light: {
    text: '#0d141b',
    background: '#f6f7f8',
    tint: tintColorLight,
    icon: '#4c739a',
    tabIconDefault: '#4c739a',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#e7edf3',
    primary: '#4299f0',
    subtle: '#4c739a',
    accent: {
      blue: '#67E8F9',
      mint: '#A7F3D0',
      lavender: '#8E85FF'
    }
  },
  dark: {
    text: '#f0f2f5',
    background: '#101922',
    tint: tintColorDark,
    icon: '#a0b3c6',
    tabIconDefault: '#a0b3c6',
    tabIconSelected: tintColorDark,
    card: '#1a2836',
    border: '#2d3e4e',
    primary: '#4299f0',
    subtle: '#a0b3c6',
    accent: {
      blue: '#67E8F9',
      mint: '#A7F3D0',
      lavender: '#8E85FF'
    }
  },
};

export const Fonts = Platform.select({
  ios: {
    /** Main font family */
    sans: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
  },
  default: {
    sans: 'PlusJakartaSans-Regular',
    medium: 'PlusJakartaSans-Medium',
    bold: 'PlusJakartaSans-Bold',
    extraBold: 'PlusJakartaSans-ExtraBold',
  },
  web: {
    sans: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    medium: "'Plus Jakarta Sans Medium', sans-serif",
    bold: "'Plus Jakarta Sans Bold', sans-serif",
    extraBold: "'Plus Jakarta Sans ExtraBold', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
