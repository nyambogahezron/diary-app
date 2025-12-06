import { create } from 'zustand';
import { database } from '../services';
import type { DiaryEntry, SearchFilters } from '../types';

interface EntriesState {
  entries: DiaryEntry[];
  isLoading: boolean;
  loadEntries: () => Promise<void>;
  createEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<DiaryEntry>;
  updateEntry: (entry: DiaryEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  searchEntries: (filters: SearchFilters) => Promise<DiaryEntry[]>;
  getEntry: (id: string) => Promise<DiaryEntry | null>;
  getEntriesByDate: (date: string) => Promise<DiaryEntry[]>;
}

export const useEntriesStore = create<EntriesState>((set, get) => ({
  entries: [],
  isLoading: false,

  loadEntries: async () => {
    set({ isLoading: true });
    try {
      const entries = await database.getAllEntries();
      set({ entries, isLoading: false });
    } catch (error) {
      console.error('Error loading entries:', error);
      set({ isLoading: false });
    }
  },

  createEntry: async (entryData) => {
    try {
      const now = new Date().toISOString();
      const entry: DiaryEntry = {
        ...entryData,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      await database.createEntry(entry);
      await get().loadEntries();
      return entry;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error;
    }
  },

  updateEntry: async (entry) => {
    try {
      const updated = { ...entry, updatedAt: new Date().toISOString() };
      await database.updateEntry(updated);
      await get().loadEntries();
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  },

  deleteEntry: async (id) => {
    try {
      await database.deleteEntry(id);
      await get().loadEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  },

  searchEntries: async (filters) => {
    try {
      let entries: DiaryEntry[] = [];

      if (filters.query) {
        entries = await database.searchEntries(filters.query);
      } else if (filters.startDate && filters.endDate) {
        entries = await database.getEntriesByDateRange(filters.startDate, filters.endDate);
      } else {
        entries = await database.getAllEntries();
      }

      // Apply additional filters
      if (filters.tags && filters.tags.length > 0) {
        // Filter by tags would require joining with entry_tags
        // For now, we'll filter client-side
      }
      if (filters.mood !== undefined) {
        entries = entries.filter((e) => e.mood === filters.mood);
      }

      return entries;
    } catch (error) {
      console.error('Error searching entries:', error);
      return [];
    }
  },

  getEntry: async (id) => {
    try {
      return await database.getEntry(id);
    } catch (error) {
      console.error('Error getting entry:', error);
      return null;
    }
  },

  getEntriesByDate: async (date) => {
    try {
      return await database.getEntriesByDate(date);
    } catch (error) {
      console.error('Error getting entries by date:', error);
      return [];
    }
  },
}));

