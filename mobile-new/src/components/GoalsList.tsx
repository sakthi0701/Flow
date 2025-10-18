import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Goal = {
  id: string;
  title: string;
  progress: number;
  dueDate: string;
};

export const GoalsList: React.FC = () => {
  const goals: Goal[] = [
    {
      id: '1',
      title: 'Complete Research Paper',
      progress: 60,
      dueDate: '2025-11-15',
    },
    // Add more goals as needed
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  goalItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progress: {
    height: '100%',
    backgroundColor: '#4285f4',
    borderRadius: 3,
  },
  dueDate: {
    fontSize: 12,
    color: '#666',
  },
});