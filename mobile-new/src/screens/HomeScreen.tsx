import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { PriorityMatrix } from '../components/priority-matrix';
import { Goals } from '../components/goals';
import { BottomNav } from '../../components/bottom-nav';
import type { ColorScheme } from '../../types/theme';
import { IconSymbol } from '../../components/ui/icon-symbol';

const HOUR_HEIGHT = 96; // 6rem

function getEventPosition(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const minutesSince9AM = (hours - 9) * 60 + minutes;
  return (minutesSince9AM / 60) * HOUR_HEIGHT + 24; // 24px for header padding
}

function getEventHeight(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const durationInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  return (durationInMinutes / 60) * HOUR_HEIGHT - 8; // -8px for gap between events
}

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.background + 'CC',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  timeline: {
    paddingLeft: 60,
    paddingRight: 16,
  },
  timeSlot: {
    flexDirection: 'row',
    height: HOUR_HEIGHT,
  },
  timeText: {
    position: 'absolute',
    left: -48,
    top: -10,
    width: 40,
    fontSize: 12,
    textAlign: 'center',
    color: colors.subtle,
  },
  timeGrid: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '40',
  },
  event: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderLeftWidth: 4,
    borderRadius: 20,
    padding: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: colors.subtle,
  },
  eventTime: {
    fontSize: 12,
    color: colors.subtle,
    marginTop: 'auto',
    alignSelf: 'flex-end',
  },
  focusBar: {
    position: 'absolute',
    bottom: 90, // Adjust to sit above your BottomNav
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 99,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  focusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  focusText: {
    flex: 1,
    fontSize: 16,
  },
});

type Event = {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  color: string;
};

export const HomeScreen: React.FC<any> = ({ navigation, route }) => {
  // 1. Cast the theme here
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
  
  // 2. Pass the typed colors to makeStyles
  const styles = makeStyles(colors);
  
  const events: Event[] = [
    {
      title: 'Physics Lecture',
      location: 'Room 301',
      startTime: '9:30',
      endTime: '11:30',
      color: colors.accent.blue,
    },
    {
      title: 'Group Project',
      location: 'Library',
      startTime: '13:00',
      endTime: '14:30',
      color: colors.accent.lavender,
    },
    {
      title: 'Gym Session',
      location: 'University Gym',
      startTime: '18:00',
      endTime: '19:00',
      color: colors.accent.mint,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Monday, 23</Text>
        <IconSymbol name="calendar" size={24} color={colors.text} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={styles.timeSlot}>
              <Text style={styles.timeText}>{`${(i + 9).toString().padStart(2, '0')}:00`}</Text>
              <View style={styles.timeGrid} />
            </View>
          ))}
          
          {events.map((event, index) => (
            <View 
              key={index}
              style={[
                styles.event,
                {
                  top: getEventPosition(event.startTime),
                  height: getEventHeight(event.startTime, event.endTime),
                  backgroundColor: event.color + '20',
                  borderLeftColor: event.color,
                }
              ]}
            >
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <Text style={styles.eventTime}>{`${event.startTime} - ${event.endTime}`}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Focus Bar from image_890305.png */}
      <View style={[styles.focusBar, { backgroundColor: colors.card, shadowColor: '#000' }]}>
        <View style={[styles.focusIcon, { backgroundColor: colors.primary + '20'}]}>
            {/* Using an emoji as a placeholder, replace with your 'focus' icon */}
            <Text style={{fontSize: 20}}>✨</Text> 
        </View>
        <Text style={[styles.focusText, { color: colors.subtle }]}>
            What's our focus for today?
        </Text>
        <IconSymbol name="mic" size={24} color={colors.text} />
      </View>

      <BottomNav navigation={navigation} route={route} />
    </View>
  );
};