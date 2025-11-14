import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { ColorScheme } from '../../types/theme';
import { InteractiveCalendar, CalendarEvent } from '../components/InteractiveCalendar';
import { api } from '../services/api';

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export const HomeScreen: React.FC<any> = () => {
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

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Physics Lecture',
      location: 'Room 301',
      startTime: '09:30',
      endTime: '11:30',
      color: colors.accent.blue,
      date: new Date().toISOString().split('T')[0],
      description: 'Introduction to quantum mechanics',
    },
    {
      id: '2',
      title: 'Group Project',
      location: 'Library',
      startTime: '13:00',
      endTime: '14:30',
      color: colors.accent.lavender,
      date: new Date().toISOString().split('T')[0],
      description: 'Working on the final presentation',
    },
    {
      id: '3',
      title: 'Gym Session',
      location: 'University Gym',
      startTime: '18:00',
      endTime: '19:00',
      color: colors.accent.mint,
      date: new Date().toISOString().split('T')[0],
      description: 'Cardio and strength training',
    },
  ]);

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <View style={styles.container}>
      <InteractiveCalendar
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </View>
  );
};