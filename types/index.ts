export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
  mood?: number; // 1-5 or emoji code
  moodEmoji?: string;
  templateId?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface EntryTag {
  entryId: string;
  tagId: string;
}

export interface MediaAttachment {
  id: string;
  entryId: string;
  type: 'image' | 'video' | 'audio' | 'file';
  uri: string;
  thumbnailUri?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string; // Template structure
  category: 'daily' | 'gratitude' | 'dream' | 'bullet' | 'custom';
  createdAt: string;
}

export interface MoodData {
  date: string;
  mood: number;
  moodEmoji: string;
  entryId: string;
}

export interface Reminder {
  id: string;
  enabled: boolean;
  time: string; // HH:mm format
  days: number[]; // 0-6, Sunday-Saturday
}

export interface AppSettings {
  theme: 'dark';
  fontSize: 'small' | 'medium' | 'large';
  biometricEnabled: boolean;
  pinEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime?: string;
  cloudSyncEnabled: boolean;
  cloudSyncProvider?: 'firebase' | 'supabase' | 'icloud' | 'googledrive';
}

export interface SearchFilters {
  query?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  mood?: number;
}

