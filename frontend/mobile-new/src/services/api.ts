/**
 * API Service for connecting mobile frontend to Python backend
 * This service handles all communication with the backend integration layer
 */

export interface ScheduleItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: string;
  priority?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  urgent: boolean;
  important: boolean;
  completed: boolean;
  classId?: string;
  goalId?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  progress: number;
}

export interface Class {
  id: string;
  title: string;
  professor?: string;
  syllabus?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserPreferences {
  coachPersonality: 'friendly' | 'professional' | 'minimal';
  breakDuration: number;
  workDuration: number;
  googleSync: boolean;
  geminiApiKey: string;
}

// API base URL - using the development machine's IP address for development
// Make sure the backend is running on the same machine
const API_URL = 'http://172.18.142.102:5000';

// API Service Functions

export const api = {
  // Schedule APIs
  getSchedule: async (userId: string, date: string): Promise<ScheduleItem[]> => {
    try {
      console.log(`Fetching schedule for user ${userId} on ${date}`);
      const response = await fetch(`${API_URL}/get_schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          query: `Schedule for ${date}`
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.schedule || [];
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
      // Return empty array as fallback
      return [];
    }
  },

  // Task APIs
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      console.log(`Fetching tasks for user ${userId}`);
      // For now, we'll return an empty array since there's no specific endpoint
      // In a full implementation, there would be a dedicated endpoint
      return [];
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      return [];
    }
  },

  addTask: async (userId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    try {
      console.log(`Adding task for user ${userId}:`, task);
      const response = await fetch(`${API_URL}/update_task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          task: task
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Return the task with an ID (in a real implementation, the backend would provide this)
      return {
        ...task,
        id: Math.random().toString(36).substr(2, 9)
      };
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  },

  updateTask: async (userId: string, taskId: string, updates: Partial<Task>): Promise<Task> => {
    try {
      console.log(`Updating task ${taskId} for user ${userId}:`, updates);
      // In a real implementation, we would send the updates to the backend
      // For now, we'll just simulate a successful update
      return {
        ...updates as Task,
        id: taskId
      };
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  },

  deleteTask: async (userId: string, taskId: string): Promise<void> => {
    try {
      console.log(`Deleting task ${taskId} for user ${userId}`);
      // In a real implementation, we would send a delete request to the backend
      // For now, we'll just simulate a successful deletion
      return;
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  },

  // Goal APIs
  getGoals: async (userId: string): Promise<Goal[]> => {
    try {
      console.log(`Fetching goals for user ${userId}`);
      // For now, we'll return an empty array since there's no specific endpoint
      // In a full implementation, there would be a dedicated endpoint
      return [];
    } catch (error) {
      console.error('Failed to fetch goals:', error);
      return [];
    }
  },

  addGoal: async (userId: string, goal: Omit<Goal, 'id' | 'progress'>): Promise<Goal> => {
    try {
      console.log(`Adding goal for user ${userId}:`, goal);
      const response = await fetch(`${API_URL}/add_goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          goal: {
            ...goal,
            progress: 0
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Return the goal with an ID and progress (in a real implementation, the backend would provide this)
      return {
        ...goal,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0
      };
    } catch (error) {
      console.error('Failed to add goal:', error);
      throw error;
    }
  },

  updateGoal: async (userId: string, goalId: string, updates: Partial<Goal>): Promise<Goal> => {
    try {
      console.log(`Updating goal ${goalId} for user ${userId}:`, updates);
      // In a real implementation, we would send the updates to the backend
      // For now, we'll just simulate a successful update
      return {
        ...updates as Goal,
        id: goalId
      };
    } catch (error) {
      console.error('Failed to update goal:', error);
      throw error;
    }
  },

  deleteGoal: async (userId: string, goalId: string): Promise<void> => {
    try {
      console.log(`Deleting goal ${goalId} for user ${userId}`);
      // In a real implementation, we would send a delete request to the backend
      // For now, we'll just simulate a successful deletion
      return;
    } catch (error) {
      console.error('Failed to delete goal:', error);
      throw error;
    }
  },

  // Class APIs
  getClasses: async (userId: string): Promise<Class[]> => {
    try {
      console.log(`Fetching classes for user ${userId}`);
      // For now, we'll return an empty array since there's no specific endpoint
      // In a full implementation, there would be a dedicated endpoint
      return [];
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      return [];
    }
  },

  addClass: async (userId: string, cls: Omit<Class, 'id'>): Promise<Class> => {
    try {
      console.log(`Adding class for user ${userId}:`, cls);
      // In a real implementation, we would send the class to the backend
      // For now, we'll just simulate a successful addition
      return {
        ...cls,
        id: Math.random().toString(36).substr(2, 9)
      };
    } catch (error) {
      console.error('Failed to add class:', error);
      throw error;
    }
  },

  // Chat APIs
  getChatMessages: async (userId: string): Promise<ChatMessage[]> => {
    try {
      console.log(`Fetching chat messages for user ${userId}`);
      // For now, we'll return an empty array since there's no specific endpoint
      // In a full implementation, there would be a dedicated endpoint or WebSocket connection
      return [];
    } catch (error) {
      console.error('Failed to fetch chat messages:', error);
      return [];
    }
  },

  sendChatMessage: async (userId: string, message: string): Promise<any> => {
    try {
      console.log(`Sending chat message for user ${userId}:`, message);
      const response = await fetch(`${API_URL}/chat_command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          command: message
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Backend response data:', data);
      return data;
    } catch (error) {
      console.error('Failed to send chat message:', error);
      throw error;
    }
  },

  // Preferences APIs
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    try {
      console.log(`Fetching preferences for user ${userId}`);
      // Return default preferences
      return {
        coachPersonality: 'friendly',
        breakDuration: 15,
        workDuration: 45,
        googleSync: false,
        geminiApiKey: ''
      };
    } catch (error) {
      console.error('Failed to fetch preferences:', error);
      // Return default preferences as fallback
      return {
        coachPersonality: 'friendly',
        breakDuration: 15,
        workDuration: 45,
        googleSync: false,
        geminiApiKey: ''
      };
    }
  },

  updatePreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    try {
      console.log(`Updating preferences for user ${userId}:`, preferences);
      // In a real implementation, we would send the preferences to the backend
      // For now, we'll just simulate a successful update
      const currentPrefs = await api.getPreferences(userId);
      return {
        ...currentPrefs,
        ...preferences
      };
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }
};