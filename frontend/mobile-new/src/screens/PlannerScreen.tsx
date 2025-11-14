import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Collapsible } from '../../components/ui/collapsible'; 
import type { ColorScheme } from '../../types/theme'; // <-- 1. Import ColorScheme

export const PlannerScreen: React.FC = () => {
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Academic Planner</Text>

      {/* --- CLASSES SECTION --- */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Classes</Text>
            <TouchableOpacity>
                <Text style={[styles.addButtonText, { color: colors.primary }]}>Add Class</Text>
            </TouchableOpacity>
        </View>
        
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Collapsible title="History of Art">
            <Text style={[styles.professor, { color: colors.subtle, marginTop: 4 }]}>Prof. Eleanor Vance</Text>
            <Text style={[styles.notesLabel, { color: colors.subtle, marginTop: 16 }]}>
                Notes (Syllabus text or add notes here. The AI will use this to generate tasks.)
            </Text>
            <TextInput
              style={[styles.notesInput, { borderColor: colors.border, color: colors.text }]}
              multiline
              placeholder="Paste syllabus text..."
              placeholderTextColor={colors.subtle}
            />
            <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.primary + '20'}]}>
              <Text style={[styles.uploadButtonText, { color: colors.primary }]}>Upload Syllabus File</Text>
            </TouchableOpacity>
          </Collapsible>
        </View>
        {/* You can add more class cards here */}
      </View>
      
      {/* --- STUDY PLAN SECTION --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Study Plan</Text>
        <View style={[styles.card, styles.planCard, { backgroundColor: colors.card }]}>
          {/* Add the image here if you have it */}
          {/* <Image source={...} style={styles.planImage} /> */}
          <Text style={[styles.planTitle, { color: colors.text }]}>Study Plan Visualization</Text>
          <Text style={[styles.planText, { color: colors.subtle }]}>
            Your auto-generated plan based on your classes.
          </Text>
          <TouchableOpacity style={[styles.viewButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.viewButtonText}>View Full Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* --- EXAM COUNTDOWN --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Exam Countdown</Text>
        <View style={[styles.card, { backgroundColor: colors.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View>
            <Text style={[styles.examTitle, { color: colors.text }]}>Finals Week</Text>
            <Text style={[styles.dueDate, { color: colors.subtle }]}>Starts in 15 days</Text>
          </View>
          <View style={[styles.countdownCircle, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.countdownText, { color: colors.primary }]}>15</Text>
          </View>
        </View>
      </View>
      
      {/* --- UPCOMING MILESTONES --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Milestones</Text>
        <View style={[styles.card, { backgroundColor: colors.card, marginBottom: 12 }]}>
          <Text style={[styles.milestoneTitle, { color: colors.text }]}>Research Paper</Text>
          <Text style={[styles.dueDate, { color: colors.subtle }]}>Due: May 15</Text>
        </View>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.milestoneTitle, { color: colors.text }]}>Group Presentation</Text>
          <Text style={[styles.dueDate, { color: colors.subtle }]}>Due: May 22</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingTop: 48, // Add padding for status bar
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  professor: {
    fontSize: 14,
  },
  notesLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  uploadButton: {
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  planCard: {
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  planText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  viewButton: {
    width: '100%',
    padding: 14,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  dueDate: {
    fontSize: 14,
    marginTop: 2,
  },
  countdownCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});