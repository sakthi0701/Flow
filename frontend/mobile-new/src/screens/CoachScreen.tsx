import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { MessageBubble } from '../components/chat/message-bubble';
import { api, ChatMessage } from '../services/api';
import { ChatInput } from '../components/chat/chat-input';

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
  const theme = useTheme();
  const colors = {
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

  // Load chat history when component mounts
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      // For now, we'll start with a welcome message since we don't have persistent chat history
      if (messages.length === 0) {
        const welcomeMessage: Message = {
          id: 'welcome',
          type: 'assistant',
          content: 'Hello! I\'m your AI coach. How can I help you today?'
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSend = useCallback(async (message: string) => {
    if (message.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: message.trim(),
      };
      
      // Add user message to UI immediately
      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);
      
      try {
        // Send message to backend
        const response = await api.sendChatMessage('default-user', message.trim());
        console.log('Backend response:', response);
        
        // Process the backend response
        let responseContent = "I've received your message. ";
        
        // Check if there are errors in the response
        if (response && response.errors && response.errors.length > 0) {
          // Extract error information
          const errorMessages = response.errors.map((err: any) => err.error).join(', ');
          responseContent = `I encountered an error while processing your request: ${errorMessages}`;
        } 
        // Check if there's a reply or response property
        else if (response && typeof response === 'object') {
          if (response.reply) {
            responseContent = response.reply;
          } else if (response.response) {
            responseContent = response.response;
          } else if (response.schedule && Array.isArray(response.schedule)) {
            if (response.schedule.length > 0) {
              responseContent = `I found ${response.schedule.length} items in your schedule.`;
            } else {
              responseContent = "I couldn't find anything in your schedule.";
            }
          } else if (response.parsed) {
            // Try to create a meaningful response based on parsed intent
            const intent = response.parsed.intent;
            if (intent === 'schedule_task') {
              responseContent = "I can help you schedule tasks. What would you like to schedule?";
            } else {
              responseContent = `I processed your request with intent: ${intent}`;
            }
          } else {
            responseContent = "I've processed your request successfully.";
          }
        } else if (typeof response === 'string') {
          responseContent = response;
        }
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: responseContent
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      } catch (error) {
        console.error('Failed to send message:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.'
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }
    }
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
      keyboardVerticalOffset={insets.bottom}
    >
      <View style={styles.contentContainer}>
        {renderMessages()}
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
    textAlign: 'center',
    marginBottom: 24,
  },
  typingIndicator: {
    padding: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default CoachScreen;