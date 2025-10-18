import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

type Event = {
  id: string;
  title: string;
  time: string;
  location?: string;
};

export const EventList: React.FC = () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Math Study Group',
      time: '10:00 AM - 11:30 AM',
      location: 'Library Room 204',
    },
    // Add more events as needed
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
            {item.location && (
              <Text style={styles.eventLocation}>{item.location}</Text>
            )}
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
  eventItem: {
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
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#4285f4',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
  },
});