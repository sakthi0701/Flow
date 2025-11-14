import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { ColorScheme } from '../../types/theme';

type Class = {
  id: string;
  name: string;
  instructor: string;
  time: string;
};

export const ClassesList: React.FC = () => {
  const theme = useTheme();
  const colors: ColorScheme = {
    ...theme.colors,
    tint: theme.colors.primary,
    icon: theme.colors.text,
    tabIconDefault: theme.colors.border,
    tabIconSelected: theme.colors.primary,
    primary: theme.colors.primary,
    subtle: theme.colors.border,
    accent: {
      blue: '#67E8F9',
      mint: '#A7F3D0',
      lavender: '#8E85FF'
    }
  };

  const styles = makeStyles(colors);

  const classes: Class[] = [
    {
      id: '1',
      name: 'Advanced Mathematics',
      instructor: 'Dr. Smith',
      time: 'Mon, Wed 10:00 AM',
    },
    {
      id: '2',
      name: 'Physics',
      instructor: 'Prof. Johnson',
      time: 'Tue, Thu 2:00 PM',
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.classItem}>
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.instructor}>{item.instructor}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
};

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
  },
  classItem: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  instructor: {
    fontSize: 14,
    color: colors.subtle,
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: colors.primary,
  },
});