import { create } from 'zustand';
import { database } from '../services';
import type { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  isLoading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 'medium',
  biometricEnabled: false,
  pinEnabled: false,
  reminderEnabled: false,
  cloudSyncEnabled: false,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaultSettings,
  isLoading: true,

  loadSettings: async () => {
    try {
      const settings = await database.getAllSettings();
      const parsedSettings: AppSettings = {
        theme: 'dark',
        fontSize: (settings.fontSize as AppSettings['fontSize']) || 'medium',
        biometricEnabled: settings.biometricEnabled === 'true',
        pinEnabled: settings.pinEnabled === 'true',
        reminderEnabled: settings.reminderEnabled === 'true',
        reminderTime: settings.reminderTime || undefined,
        cloudSyncEnabled: settings.cloudSyncEnabled === 'true',
        cloudSyncProvider: settings.cloudSyncProvider as AppSettings['cloudSyncProvider'] || undefined,
      };
      set({ ...parsedSettings, isLoading: false });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  updateSettings: async (newSettings: Partial<AppSettings>) => {
    try {
      const current = get();
      const updated = { ...current, ...newSettings };
      
      // Save to database
      await Promise.all([
        database.saveSetting('theme', updated.theme),
        database.saveSetting('fontSize', updated.fontSize),
        database.saveSetting('biometricEnabled', updated.biometricEnabled.toString()),
        database.saveSetting('pinEnabled', updated.pinEnabled.toString()),
        database.saveSetting('reminderEnabled', updated.reminderEnabled.toString()),
        updated.reminderTime && database.saveSetting('reminderTime', updated.reminderTime),
        database.saveSetting('cloudSyncEnabled', updated.cloudSyncEnabled.toString()),
        updated.cloudSyncProvider && database.saveSetting('cloudSyncProvider', updated.cloudSyncProvider),
      ]);

      set(updated);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },
}));

