/**
 * API Service for connecting mobile frontend to Python backend
 * This service handles all communication with the backend integration layer
 */

// For now, we'll simulate API calls with mock data
// In a real implementation, these would connect to the Python backend

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

// Mock data for initial implementation
const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    title: 'Math Lecture',
    startTime: '2025-10-18T09:00:00',
    endTime: '2025-10-18T10:30:00',
    category: 'class',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Study Session',
    startTime: '2025-10-18T14:00:00',
    endTime: '2025-10-18T15:30:00',
    category: 'study',
    priority: 'medium'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Math Homework',
    description: 'Problems 1-20 from chapter 5',
    urgent: true,
    important: true,
    completed: false,
    classId: 'math101'
  },
  {
    id: '2',
    title: 'Read History Chapter',
    description: 'Chapter 12: World War II',
    urgent: false,
    important: true,
    completed: false,
    classId: 'hist201'
  }
];

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Ace Final Exams',
    description: 'Get A in all subjects',
    deadline: '2025-12-15',
    progress: 30
  }
];

const mockClasses: Class[] = [
  {
    id: 'math101',
    title: 'Calculus I',
    professor: 'Dr. Smith',
    syllabus: 'Limits, derivatives, and integrals'
  },
  {
    id: 'hist201',
    title: 'World History',
    professor: 'Prof. Johnson',
    syllabus: 'From ancient civilizations to modern times'
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content: 'Hello! I\'m your AI coach. How can I help you today?',
    timestamp: '2025-10-18T09:00:00'
  }
];

let mockPreferences: UserPreferences = {
  coachPersonality: 'friendly',
  breakDuration: 15,
  workDuration: 45,
  googleSync: false,
  geminiApiKey: ''
};

// API Service Functions

export const api = {
  // Schedule APIs
  getSchedule: async (userId: string, date: string): Promise<ScheduleItem[]> => {
    // In real implementation: fetch from backend
    console.log(`Fetching schedule for user ${userId} on ${date}`);
    return new Promise(resolve => setTimeout(() => resolve(mockSchedule), 500));
  },

  // Task APIs
  getTasks: async (userId: string): Promise<Task[]> => {
    console.log(`Fetching tasks for user ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(mockTasks), 500));
  },

  addTask: async (userId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    console.log(`Adding task for user ${userId}:`, task);
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockTasks.push(newTask);
    return new Promise(resolve => setTimeout(() => resolve(newTask), 500));
  },

  updateTask: async (userId: string, taskId: string, updates: Partial<Task>): Promise<Task> => {
    console.log(`Updating task ${taskId} for user ${userId}:`, updates);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
      return new Promise(resolve => setTimeout(() => resolve(mockTasks[taskIndex]), 500));
    }
    throw new Error('Task not found');
  },

  deleteTask: async (userId: string, taskId: string): Promise<void> => {
    console.log(`Deleting task ${taskId} for user ${userId}`);
    const taskIndex = mockTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
      return new Promise(resolve => setTimeout(() => resolve(), 500));
    }
    throw new Error('Task not found');
  },

  // Goal APIs
  getGoals: async (userId: string): Promise<Goal[]> => {
    console.log(`Fetching goals for user ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(mockGoals), 500));
  },

  addGoal: async (userId: string, goal: Omit<Goal, 'id' | 'progress'>): Promise<Goal> => {
    console.log(`Adding goal for user ${userId}:`, goal);
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0
    };
    mockGoals.push(newGoal);
    return new Promise(resolve => setTimeout(() => resolve(newGoal), 500));
  },

  updateGoal: async (userId: string, goalId: string, updates: Partial<Goal>): Promise<Goal> => {
    console.log(`Updating goal ${goalId} for user ${userId}:`, updates);
    const goalIndex = mockGoals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      mockGoals[goalIndex] = { ...mockGoals[goalIndex], ...updates };
      return new Promise(resolve => setTimeout(() => resolve(mockGoals[goalIndex]), 500));
    }
    throw new Error('Goal not found');
  },

  deleteGoal: async (userId: string, goalId: string): Promise<void> => {
    console.log(`Deleting goal ${goalId} for user ${userId}`);
    const goalIndex = mockGoals.findIndex(g => g.id === goalId);
    if (goalIndex !== -1) {
      mockGoals.splice(goalIndex, 1);
      return new Promise(resolve => setTimeout(() => resolve(), 500));
    }
    throw new Error('Goal not found');
  },

  // Class APIs
  getClasses: async (userId: string): Promise<Class[]> => {
    console.log(`Fetching classes for user ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(mockClasses), 500));
  },

  addClass: async (userId: string, cls: Omit<Class, 'id'>): Promise<Class> => {
    console.log(`Adding class for user ${userId}:`, cls);
    const newClass: Class = {
      ...cls,
      id: Math.random().toString(36).substr(2, 9)
    };
    mockClasses.push(newClass);
    return new Promise(resolve => setTimeout(() => resolve(newClass), 500));
  },

  // Chat APIs
  getChatMessages: async (userId: string): Promise<ChatMessage[]> => {
    console.log(`Fetching chat messages for user ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(mockMessages), 500));
  },

  sendChatMessage: async (userId: string, message: string): Promise<ChatMessage> => {
    console.log(`Sending chat message for user ${userId}:`, message);
    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    mockMessages.push(userMessage);
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'assistant',
        content: 'I understand. Let me help you with that.',
        timestamp: new Date().toISOString()
      };
      mockMessages.push(aiMessage);
    }, 1000);
    
    return new Promise(resolve => setTimeout(() => resolve(userMessage), 500));
  },

  // Preferences APIs
  getPreferences: async (userId: string): Promise<UserPreferences> => {
    console.log(`Fetching preferences for user ${userId}`);
    return new Promise(resolve => setTimeout(() => resolve(mockPreferences), 500));
  },

  updatePreferences: async (userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    console.log(`Updating preferences for user ${userId}:`, preferences);
    mockPreferences = { ...mockPreferences, ...preferences };
    return new Promise(resolve => setTimeout(() => resolve(mockPreferences), 500));
  }
};