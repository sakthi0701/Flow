// Lightweight API adapter stub - replace with real HTTP calls when backend API is available
import type { ScheduleEvent, ChatMessage, Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '';

export async function getSchedule(userId: string, query: string) {
  if (API_URL) {
    // TODO: implement HTTP call
    return fetch(`${API_URL}/get_schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, query }),
    }).then((r) => r.json());
  }

  // Fallback stub response
  return {
    schedule: [
      {
        id: 's1',
        title: 'DSA Practice',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        category: 'study',
        isAiGenerated: true,
      },
    ],
  };
}

export async function chatCommand(userId: string, command: string) {
  if (API_URL) {
    return fetch(`${API_URL}/chat_command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, command }),
    }).then((r) => r.json());
  }

  // stub response
  return {
    reply: `I heard: ${command}. (This is a stub response from the frontend.)`,
  };
}

export async function updateTask(userId: string, task: Task) {
  if (API_URL) {
    return fetch(`${API_URL}/update_task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, task }),
    }).then((r) => r.json());
  }

  return { ok: true };
}
