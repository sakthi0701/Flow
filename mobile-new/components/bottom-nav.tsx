import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './ui/icon-symbol';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ParamListBase, RouteProp } from '@react-navigation/native';

type NavItem = {
  name: string;
  icon: string;
  label: string;
  route: string;
};

const NAV_ITEMS: NavItem[] = [
  { name: 'home', icon: 'house.fill', label: 'Home', route: 'Home' },
  { name: 'focus', icon: 'timer', label: 'Focus', route: 'Focus' },
  { name: 'coach', icon: 'person.2.fill', label: 'Coach', route: 'Coach' },
  { name: 'dashboard', icon: 'chart.bar.fill', label: 'Dashboard', route: 'Dashboard' },
  { name: 'more', icon: 'line.3.horizontal', label: 'More', route: 'More' },
];

type BottomNavProps = {
  navigation: BottomTabNavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};

export function BottomNav({ navigation, route }: BottomNavProps) {
  const { colors } = useTheme();
  const currentRoute = route?.name;

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isCurrent = currentRoute === item.route;
          return (
            <Pressable
              key={item.name}
              style={styles.item}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={[styles.itemContent, isCurrent && { 
                backgroundColor: colors.primary + '20',
                borderRadius: 24,
                padding: 12
              }]}>
                <IconSymbol
                  name={item.icon}
                  size={24}
                  color={isCurrent ? colors.primary : colors.icon}
                />
                <Text
                  style={[
                    styles.label,
                    { color: isCurrent ? colors.primary : colors.icon },
                    isCurrent && styles.labelBold,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.safeArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  itemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  labelBold: {
    fontFamily: 'PlusJakartaSans-Bold',
  },
  safeArea: {
    height: 4,
  },
});