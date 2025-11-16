import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { useSettingsStore } from '../store/useSettingsStore';
import { useThemeVariables } from '../utils/nativewind-theme';

interface ThemeContextValue {
  theme: string;
  isDark: boolean;
  isNature: boolean;
  isOcean: boolean;
  isSunset: boolean;
  currentTheme: string;
  effectiveTheme: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { colorScheme } = useColorScheme();
  const { theme } = useSettingsStore();
  const { getThemeVariables } = useThemeVariables();

  const isDark = theme === 'dark' || (theme === 'auto' && colorScheme === 'dark');
  const isNature = theme === 'nature';
  const isOcean = theme === 'ocean';
  const isSunset = theme === 'sunset';
  
  const effectiveTheme = theme === 'auto' ? colorScheme || 'light' : theme;
  
  // Get the theme variables for this theme
  const themeVars = getThemeVariables(theme);

  const value: ThemeContextValue = {
    theme: effectiveTheme,
    isDark,
    isNature,
    isOcean,
    isSunset,
    currentTheme: theme,
    effectiveTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <View style={themeVars} className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

// Hook to get theme-aware styles
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Legacy hook for backward compatibility
export function useThemeStyles() {
  return useTheme();
}

// Theme metadata for UI components
export const themeMetadata = {
  light: {
    name: 'Light',
    description: 'Clean and bright interface',
    icon: '☀️',
    preview: '#ffffff',
    accent: '#3b82f6', // blue-500
  },
  dark: {
    name: 'Dark',
    description: 'Easy on the eyes',
    icon: '🌙',
    preview: '#1f2937',
    accent: '#3b82f6', // blue-500
  },
  auto: {
    name: 'Auto',
    description: 'Follows system setting',
    icon: '🤖',
    preview: '#6b7280',
    accent: '#3b82f6', // blue-500
  },
  nature: {
    name: 'Nature',
    description: 'Inspired by forests and greenery',
    icon: '🌿',
    preview: '#22c55e',
    accent: '#22c55e', // green-500
  },
  ocean: {
    name: 'Ocean',
    description: 'Calming blues and teals',
    icon: '🌊',
    preview: '#0ea5e9',
    accent: '#0ea5e9', // sky-500
  },
  sunset: {
    name: 'Sunset',
    description: 'Warm oranges and yellows',
    icon: '🌅',
    preview: '#fb923c',
    accent: '#fb923c', // orange-400
  },
} as const;