// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'timer': 'timer',
  'person.2.fill': 'people',
  'chart.bar.fill': 'analytics',
  'line.3.horizontal': 'menu',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'xmark': 'close',
  'play.fill': 'play-arrow',
  'pause.fill': 'pause',
  'stop.fill': 'stop',
  'arrow.clockwise': 'refresh',
  'mic': 'mic', // Added for home screen
  'calendar': 'calendar-today', // Added for home screen
} as const;

type IconMapping = typeof MAPPING;
type IconSymbolName = keyof IconMapping;

type IconName = keyof typeof MAPPING;

type IconSymbolProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || 'help'; // Fallback to 'help' icon if mapping is missing
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}