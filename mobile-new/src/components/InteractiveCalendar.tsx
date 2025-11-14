import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import type { ColorScheme } from '../../types/theme';
import { IconSymbol } from '../../components/ui/icon-symbol';

const HOUR_HEIGHT = 80;

export type CalendarEvent = {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  color: string;
  date: string;
  description?: string;
};

type InteractiveCalendarProps = {
  events: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdateEvent?: (id: string, event: Partial<CalendarEvent>) => void;
  onDeleteEvent?: (id: string) => void;
};

function getEventPosition(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const minutesSince9AM = (hours - 9) * 60 + minutes;
  return (minutesSince9AM / 60) * HOUR_HEIGHT + 24;
}

function getEventHeight(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const durationInMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  return (durationInMinutes / 60) * HOUR_HEIGHT - 8;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent
}) => {
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

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    startTime: '09:00',
    endTime: '10:00',
    color: colors.accent.blue,
    description: '',
  });

  const todayEvents = events.filter(e => e.date === selectedDate);

  const markedDates = events.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = { marked: true, dots: [] };
    }
    return acc;
  }, {} as any);

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: colors.primary,
  };

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      location: event.location,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color,
      description: event.description || '',
    });
    setIsEditMode(false);
    setShowEventModal(true);
  };

  const handleAddNewEvent = () => {
    setSelectedEvent(null);
    setFormData({
      title: '',
      location: '',
      startTime: '09:00',
      endTime: '10:00',
      color: colors.accent.blue,
      description: '',
    });
    setIsEditMode(true);
    setShowEventModal(true);
  };

  const handleSaveEvent = () => {
    if (!formData.title) {
      Alert.alert('Error', 'Please enter an event title');
      return;
    }

    if (selectedEvent && !isEditMode) {
      return;
    }

    const eventData = {
      ...formData,
      date: selectedDate,
    };

    if (selectedEvent) {
      onUpdateEvent?.(selectedEvent.id, eventData);
    } else {
      onAddEvent?.(eventData);
    }

    setShowEventModal(false);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      Alert.alert(
        'Delete Event',
        'Are you sure you want to delete this event?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              onDeleteEvent?.(selectedEvent.id);
              setShowEventModal(false);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: colors.background,
          calendarBackground: colors.card,
          textSectionTitleColor: colors.subtle,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: colors.primary,
          dayTextColor: colors.text,
          textDisabledColor: colors.subtle + '40',
          monthTextColor: colors.text,
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />

      <View style={styles.dayHeader}>
        <Text style={styles.dayTitle}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Pressable onPress={handleAddNewEvent} style={styles.addButton}>
          <IconSymbol name="plus" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView style={styles.timelineContainer}>
        <View style={styles.timeline}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={styles.timeSlot}>
              <Text style={styles.timeText}>{`${(i + 9).toString().padStart(2, '0')}:00`}</Text>
              <View style={styles.timeGrid} />
            </View>
          ))}

          {todayEvents.map((event) => (
            <Pressable
              key={event.id}
              style={[
                styles.event,
                {
                  top: getEventPosition(event.startTime),
                  height: getEventHeight(event.startTime, event.endTime),
                  backgroundColor: event.color + '20',
                  borderLeftColor: event.color,
                }
              ]}
              onPress={() => handleEventPress(event)}
            >
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventLocation}>{event.location}</Text>
              <Text style={styles.eventTime}>{`${event.startTime} - ${event.endTime}`}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedEvent && !isEditMode ? 'Event Details' : isEditMode ? 'Edit Event' : 'New Event'}
              </Text>
              <Pressable onPress={() => setShowEventModal(false)}>
                <IconSymbol name="xmark" size={24} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              {(!selectedEvent || isEditMode) ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.title}
                      onChangeText={(text) => setFormData({ ...formData, title: text })}
                      placeholder="Event title"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.location}
                      onChangeText={(text) => setFormData({ ...formData, location: text })}
                      placeholder="Event location"
                    />
                  </View>

                  <View style={styles.timeRow}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={styles.label}>Start Time</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.startTime}
                        onChangeText={(text) => setFormData({ ...formData, startTime: text })}
                        placeholder="09:00"
                      />
                    </View>

                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                      <Text style={styles.label}>End Time</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.endTime}
                        onChangeText={(text) => setFormData({ ...formData, endTime: text })}
                        placeholder="10:00"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={formData.description}
                      onChangeText={(text) => setFormData({ ...formData, description: text })}
                      placeholder="Event description"
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Color</Text>
                    <View style={styles.colorPicker}>
                      {[colors.accent.blue, colors.accent.mint, colors.accent.lavender, '#FF6B6B', '#FFD93D'].map((color) => (
                        <Pressable
                          key={color}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            formData.color === color && styles.colorOptionSelected
                          ]}
                          onPress={() => setFormData({ ...formData, color })}
                        />
                      ))}
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <IconSymbol name="text.alignleft" size={20} color={colors.subtle} />
                    <Text style={styles.detailText}>{selectedEvent?.title}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <IconSymbol name="location" size={20} color={colors.subtle} />
                    <Text style={styles.detailText}>{selectedEvent?.location}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <IconSymbol name="clock" size={20} color={colors.subtle} />
                    <Text style={styles.detailText}>
                      {selectedEvent?.startTime} - {selectedEvent?.endTime}
                    </Text>
                  </View>

                  {selectedEvent?.description && (
                    <View style={styles.detailRow}>
                      <IconSymbol name="doc.text" size={20} color={colors.subtle} />
                      <Text style={styles.detailText}>{selectedEvent.description}</Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              {selectedEvent && !isEditMode ? (
                <>
                  <Pressable
                    style={[styles.button, styles.editButton]}
                    onPress={() => setIsEditMode(true)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.deleteButton]}
                    onPress={handleDeleteEvent}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setShowEventModal(false)}
                  >
                    <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSaveEvent}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineContainer: {
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
    borderRadius: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalBody: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.text,
    borderWidth: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButton: {
    backgroundColor: colors.border + '40',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
