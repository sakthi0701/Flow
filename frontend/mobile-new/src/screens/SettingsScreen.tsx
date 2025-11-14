import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { api, UserPreferences } from '../services/api';
import type { ColorScheme } from '../../types/theme'; // <-- 1. Import ColorScheme

type CoachPersonality = 'friendly' | 'professional' | 'minimal';

// 2. Remove the local ExtendedTheme type

export const SettingsScreen: React.FC = () => {
  // 3. Cast useTheme() to the correct type
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
  
  const [coachPersonality, setCoachPersonality] = useState<CoachPersonality>('friendly');
  const [breakDuration, setBreakDuration] = useState<number>(15);
  const [workDuration, setWorkDuration] = useState<number>(45);
  const [googleSync, setGoogleSync] = useState<boolean>(false);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Load preferences when component mounts
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await api.getPreferences('default-user');
      setCoachPersonality(prefs.coachPersonality);
      setBreakDuration(prefs.breakDuration);
      setWorkDuration(prefs.workDuration);
      setGoogleSync(prefs.googleSync);
      setGeminiApiKey(prefs.geminiApiKey);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      const prefs: UserPreferences = {
        coachPersonality,
        breakDuration,
        workDuration,
        googleSync,
        geminiApiKey
      };
      
      await api.updatePreferences('default-user', prefs);
      console.log('Preferences saved successfully');
      // Show success message to user
    } catch (error) {
      console.error('Failed to save preferences:', error);
      // Show error message to user
    }
  };

  const personalities: { value: CoachPersonality; label: string }[] = [
    { value: 'friendly', label: 'Friendly Mentor' },
    { value: 'professional', label: 'Professional Planner' },
    { value: 'minimal', label: 'Minimalist Coach' }
  ];

  const renderPersonalityOption = (personality: { value: CoachPersonality; label: string }) => {
    const isSelected = coachPersonality === personality.value;
    return (
      <TouchableOpacity
        key={personality.value}
        style={[
          styles.personalityOption,
          { 
            backgroundColor: isSelected ? colors.primary + '20' : colors.card,
            borderColor: isSelected ? colors.primary : colors.border
          }
        ]}
        onPress={() => setCoachPersonality(personality.value)}
      >
        <Text style={[
          styles.personalityText,
          { color: colors.text }
        ]}>
          {personality.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}>
        <Text style={{ textAlign: 'center', color: colors.text }}>Loading settings...</Text>
      </View>
    );
  }

  // 4. No need for the || fallback, as ColorScheme guarantees subtle exists
  const subtleColor = colors.subtle;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Settings</Text>
      
      {/* AI Coach Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>AI Coach</Text>
        <Text style={[styles.sectionSubtitle, { color: subtleColor }]}>
          Choose your AI coach's personality
        </Text>
        
        <View style={styles.personalityContainer}>
          {personalities.map(renderPersonalityOption)}
        </View>
      </View>
      
      {/* Work & Break Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Work & Break</Text>
        <Text style={[styles.sectionSubtitle, { color: subtleColor }]}>
          Configure your work sessions
        </Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Work Duration (minutes)</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text, 
              backgroundColor: colors.background,
              borderColor: colors.border
            }]}
            value={workDuration.toString()}
            onChangeText={(text) => setWorkDuration(parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Break Duration (minutes)</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text, 
              backgroundColor: colors.background,
              borderColor: colors.border
            }]}
            value={breakDuration.toString()}
            onChangeText={(text) => setBreakDuration(parseInt(text) || 0)}
            keyboardType="numeric"
          />
        </View>
      </View>
      
      {/* Sync Settings */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sync</Text>
        <Text style={[styles.sectionSubtitle, { color: subtleColor }]}>
          Connect with external services
        </Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Google Calendar Sync</Text>
          <Switch
            value={googleSync}
            onValueChange={setGoogleSync}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={'#fff'} // Simplified thumbColor
          />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Gemini API Key</Text>
          <TextInput
            style={[styles.input, { 
              color: colors.text, 
              backgroundColor: colors.background,
              borderColor: colors.border,
              flex: 1, // Allow input to take more space
              textAlign: 'left',
              marginLeft: 8,
              paddingLeft: 8
            }]}
            value={geminiApiKey}
            onChangeText={setGeminiApiKey}
            placeholder="Enter your API key"
            placeholderTextColor={subtleColor}
            secureTextEntry
          />
        </View>
      </View>
      
      {/* Save Button */}
      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
        onPress={savePreferences}
      >
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    margin: 16,
    paddingTop: 32, // Add padding for status bar
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  personalityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personalityOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  personalityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  settingLabel: {
    fontSize: 16,
    flexShrink: 1, // Allow label to shrink if needed
  },
  input: {
    width: 80,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: 'center',
  },
  saveButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});