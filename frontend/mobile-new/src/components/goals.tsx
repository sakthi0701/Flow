import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { ColorScheme } from '../../types/theme'; // <-- 1. Import ColorScheme

type GoalProps = {
  title: string;
  linkedTasks: number;
  linkedClasses: number;
};

const Goal: React.FC<GoalProps> = ({ title, linkedTasks, linkedClasses }) => {
  // 2. Cast the theme
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

  return (
    <View style={[styles.goalItem, { backgroundColor: colors.card }]}>
      <View style={styles.goalHeader}>
        <Text style={[styles.goalTitle, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={[styles.addButtonText, { color: colors.primary }]}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.goalSubtext, { color: colors.subtle }]}>
        Linked to: {linkedTasks} tasks, {linkedClasses} classes
      </Text>
    </View>
  );
};

export const Goals: React.FC = () => {
  // 3. Cast the theme
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

  const goals: GoalProps[] = [
    {
      title: 'Graduate with Honors',
      linkedTasks: 3,
      linkedClasses: 2,
    },
    {
      title: 'Learn to Code',
      linkedTasks: 5,
      linkedClasses: 1,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Goals</Text>
      <View style={[styles.goalsContainer, { backgroundColor: colors.card }]}>
        {goals.map((goal, index) => (
          <Goal key={index} {...goal} />
        ))}
        <TouchableOpacity style={[styles.addGoalButton, { borderColor: colors.border }]}>
          <Text style={[styles.addGoalText, { color: colors.primary }]}>+ Define New Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  goalsContainer: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 4,
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  goalSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  addGoalButton: {
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  addGoalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});