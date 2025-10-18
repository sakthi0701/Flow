import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '../../../components/ui/icon-symbol';
// 1. REMOVED the ColorScheme import

interface ChatInputProps {
  onSend: (message: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('');
  
  // 2. REMOVED the type cast. This now works.
  const { colors } = useTheme();

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background + 'E6',
            borderTopColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Chat with your coach..."
            placeholderTextColor={colors.background} // <-- 3. This property is now correctly found
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={1000}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={handleSend}
        >
          <IconSymbol name="paperplane.fill" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});