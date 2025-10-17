// Lightweight API adapter stub - replace with real HTTP calls when backend API is available
import type { Task } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getSchedule(userId: string, query: string) {
  try {
    const response = await fetch(`${API_URL}/get_schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, query }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch schedule:', error);
    return { schedule: [] }; // Return an empty schedule on error
  }
}

export async function chatCommand(userId: string, command: string) {
  try {
    const response = await fetch(`${API_URL}/chat_command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, command }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to send chat command:', error);
    return { reply: 'Error communicating with the server.' };
  }
}

export async function updateTask(userId: string, task: Task) {
  try {
    const response = await fetch(`${API_URL}/update_task`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, task }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to update task:', error);
    return { ok: false };
  }
}