import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Class = {
  id: string;
  name: string;
  instructor: string;
  time: string;
};

export const ClassesList: React.FC = () => {
  const classes: Class[] = [
    {
      id: '1',
      name: 'Advanced Mathematics',
      instructor: 'Dr. Smith',
      time: 'Mon, Wed 10:00 AM',
    },
    // Add more classes as needed
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  classItem: {
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
  className: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  instructor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#4285f4',
  },
});