import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PriorityMatrix } from '../components/PriorityMatrix';
import { GoalsList } from '../components/GoalsList';
import { ClassesList } from '../components/ClassesList';

export const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Priority Matrix</Text>
      <PriorityMatrix />
      
      <Text style={styles.header}>Goals</Text>
      <GoalsList />
      
      <Text style={styles.header}>Classes</Text>
      <ClassesList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16
  }
});