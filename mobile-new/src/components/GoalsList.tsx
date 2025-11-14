import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { ColorScheme } from '../../types/theme';

type Goal = {
  id: string;
  title: string;
  progress: number;
  dueDate: string;
};

export const GoalsList: React.FC = () => {
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

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Complete Research Paper',
      progress: 60,
      dueDate: '2025-11-15',
    },
    {
      id: '2',
      title: 'Ace Final Exams',
      progress: 30,
      dueDate: '2025-12-15',
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalTitle}>{item.title}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${item.progress}%` }]} />
            </View>
            <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
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
  goalItem: {
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
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border + '40',
    borderRadius: 3,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  dueDate: {
    fontSize: 12,
    color: colors.subtle,
  },
});