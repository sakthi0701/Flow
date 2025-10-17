export interface FixedEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  color?: string;
  category?: 'class' | 'exam' | 'personal' | 'work';
}

export interface Task {
  id: string;
  title: string;
  estimatedMinutes: number;
  priority: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'not-urgent-not-important';
  category?: string;
  completed?: boolean;
  goalId?: string;
  classId?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  linkedTaskCount: number;
  linkedClassCount: number;
}

export interface Class {
  id: string;
  title: string;
  instructor?: string;
  notes?: string;
  syllabus?: string;
}

export interface Preferences {
  breakRatio: {
    workMinutes: number;
    breakMinutes: number;
  };
  coachPersonality: 'friendly' | 'professional' | 'minimal';
  autoScheduling: boolean;
  energyTracking: 'manual' | 'auto';
  preferredStudyTime?: string;
}

export interface ScheduleEvent extends FixedEvent {
  isAiGenerated?: boolean;
  taskId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
