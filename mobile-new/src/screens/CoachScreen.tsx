import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { MessageBubble } from '../components/chat/message-bubble';
import { api, ChatMessage } from '../services/api';
import { ChatInput } from '../components/chat/chat-input'; // <-- 1. IMPORTED

export type MessageType = 'assistant' | 'user';

export interface Message {
  id: string;
  type: MessageType;
  content: string;
}

export const CoachScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const chatMessages = await api.getChatMessages('default-user');
      const formattedMessages = chatMessages.map(msg => ({
        id: msg.id,
        type: msg.type as MessageType,
        content: msg.content
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = useCallback(async (message: string) => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
      };
      
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(true);
      
      try {
        // Send message to backend
        await api.sendChatMessage('default-user', message.trim());
        
        // The API service simulates AI response, so we don't need to add it manually
        // In a real implementation, we would listen for updates or poll for responses
      } catch (error) {
        console.error('Failed to send message:', error);
        setIsTyping(false);
      }
    }
  }, []);

  // Simulate receiving AI responses
  useEffect(() => {
    // In a real implementation, we would subscribe to real-time updates
    // For now, we'll reload messages periodically to simulate updates
    const interval = setInterval(() => {
      loadChatHistory();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome to AI Coach</Text>
          <Text style={styles.welcomeSubtext}>
            I'm here to help you stay focused and achieve your goals.
            Feel free to ask me anything!
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            type={message.type}
            content={message.content}
          />
        ))}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>AI Coach is typing...</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.bottom} // <-- Use insets for vertical offset
    >
      <View style={styles.contentContainer}>
        {renderMessages()}
        {/* 2. REPLACED old input with ChatInput component */}
        <ChatInput onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  // 3. REMOVED old inputContainer, input, sendButton, sendButtonText styles
  welcomeContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  typingIndicator: {
    padding: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default CoachScreen;