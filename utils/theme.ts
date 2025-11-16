import { useColorScheme } from 'react-native';
import type { AppSettings } from '../types';

// Theme color definitions for React Native
export const themeColors = {
  light: {
    primary: '#3b82f6', // blue-500
    primaryForeground: '#ffffff',
    secondary: '#e5e7eb', // gray-200
    secondaryForeground: '#1f2937', // gray-800
    accent: '#8b5cf6', // violet-500
    accentForeground: '#ffffff',
    background: '#ffffff',
    foreground: '#111827', // gray-900
    card: '#ffffff',
    cardForeground: '#1f2937', // gray-800
    muted: '#f9fafb', // gray-50
    mutedForeground: '#6b7280', // gray-500
    border: '#e5e7eb', // gray-200
    mood: {
      1: '#ef4444', // red-500
      2: '#fb923c', // orange-400
      3: '#eab308', // yellow-500
      4: '#22c55e', // green-500
      5: '#10b981', // emerald-500
    },
  },
  dark: {
    primary: '#3b82f6', // blue-500
    primaryForeground: '#ffffff',
    secondary: '#374151', // gray-700
    secondaryForeground: '#e5e7eb', // gray-200
    accent: '#8b5cf6', // violet-500
    accentForeground: '#ffffff',
    background: '#111827', // gray-900
    foreground: '#f3f4f6', // gray-100
    card: '#1f2937', // gray-800
    cardForeground: '#e5e7eb', // gray-200
    muted: '#374151', // gray-700
    mutedForeground: '#9ca3af', // gray-400
    border: '#4b5563', // gray-600
    mood: {
      1: '#dc2626', // red-600
      2: '#ea580c', // orange-600
      3: '#ca8a04', // yellow-600
      4: '#16a34a', // green-600
      5: '#059669', // emerald-600
    },
  },
  nature: {
    primary: '#22c55e', // green-500
    primaryForeground: '#ffffff',
    secondary: '#dcfce7', // green-100
    secondaryForeground: '#14532d', // green-800
    accent: '#84cc16', // lime-500
    accentForeground: '#ffffff',
    background: '#f7fee7', // lime-50
    foreground: '#14532d', // green-800
    card: '#ffffff',
    cardForeground: '#166534', // green-700
    muted: '#ecfdf5', // green-50
    mutedForeground: '#65a30d', // lime-600
    border: '#bbf7d0', // green-200
    mood: {
      1: '#b91c1c', // red-700
      2: '#c2410c', // orange-700
      3: '#a16207', // yellow-700
      4: '#15803d', // green-700
      5: '#065f46', // emerald-700
    },
  },
  ocean: {
    primary: '#0ea5e9', // sky-500
    primaryForeground: '#ffffff',
    secondary: '#e0f2fe', // sky-100
    secondaryForeground: '#0c4a6e', // sky-800
    accent: '#06b6d4', // cyan-500
    accentForeground: '#ffffff',
    background: '#f0f9ff', // sky-50
    foreground: '#0c4a6e', // sky-800
    card: '#ffffff',
    cardForeground: '#075985', // sky-700
    muted: '#ecfeff', // cyan-50
    mutedForeground: '#0891b2', // cyan-600
    border: '#bae6fd', // sky-200
    mood: {
      1: '#be185d', // rose-700
      2: '#c2410c', // orange-700
      3: '#b45309', // amber-700
      4: '#155e75', // cyan-700
      5: '#0c4a6e', // sky-800
    },
  },
  sunset: {
    primary: '#fb923c', // orange-400
    primaryForeground: '#ffffff',
    secondary: '#fef08a', // yellow-200
    secondaryForeground: '#78350f', // orange-900
    accent: '#f43f5e', // rose-500
    accentForeground: '#ffffff',
    background: '#fffbeb', // orange-50
    foreground: '#78350f', // orange-900
    card: '#ffffff',
    cardForeground: '#9a3412', // orange-800
    muted: '#fef3c7', // yellow-100
    mutedForeground: '#d97706', // yellow-600
    border: '#fed7aa', // orange-200
    mood: {
      1: '#be185d', // rose-700
      2: '#c2410c', // orange-700
      3: '#b45309', // amber-700
      4: '#d97706', // yellow-600
      5: '#fbbf24', // yellow-400
    },
  },
} as const;

// Hook to get current theme colors for React Native components
export function useThemeColors() {
  const systemColorScheme = useColorScheme();
  
  // For now, we'll get the theme from storage/context
  // This could be enhanced to use the settings store
  const getThemeColors = (theme: AppSettings['theme']) => {
    switch (theme) {
      case 'dark':
        return themeColors.dark;
      case 'auto':
        return systemColorScheme === 'dark' ? themeColors.dark : themeColors.light;
      case 'nature':
        return themeColors.nature;
      case 'ocean':
        return themeColors.ocean;
      case 'sunset':
        return themeColors.sunset;
      case 'light':
      default:
        return themeColors.light;
    }
  };

  return {
    getThemeColors,
    themeColors,
    systemColorScheme,
  };
}

// Utility to get theme-specific style objects for React Native
export function getThemeStyle(theme: AppSettings['theme'], systemColorScheme?: 'light' | 'dark' | null) {
  const resolvedTheme = theme === 'auto' 
    ? (systemColorScheme || 'light')
    : theme;
    
  const colors = resolvedTheme === 'dark' 
    ? themeColors.dark
    : resolvedTheme === 'nature'
    ? themeColors.nature
    : resolvedTheme === 'ocean'
    ? themeColors.ocean
    : resolvedTheme === 'sunset'
    ? themeColors.sunset
    : themeColors.light;

  return {
    colors,
    theme: resolvedTheme,
    isDark: resolvedTheme === 'dark',
  };
}