import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import type { MessageType } from '../../screens/CoachScreen';
import type { ColorScheme } from '../../../types/theme'; // <-- 1. Import ColorScheme

interface MessageBubbleProps {
  type: MessageType;
  content: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ type, content }) => {
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
  const isAssistant = type === 'assistant';

  return (
    <View
      style={[
        styles.container,
        isAssistant ? styles.assistantContainer : styles.userContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isAssistant
            ? [styles.assistantBubble, { backgroundColor: colors.card }]
            : [styles.userBubble, { backgroundColor: colors.primary }],
        ]}
      >
        <Text
          style={[
            styles.text,
            { color: isAssistant ? colors.text : '#fff' },
          ]}
        >
          {content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  assistantBubble: {
    borderBottomLeftRadius: 8,
    marginRight: '20%',
  },
  userBubble: {
    borderBottomRightRadius: 8,
    marginLeft: '20%',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});