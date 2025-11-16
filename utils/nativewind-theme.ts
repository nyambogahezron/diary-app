import { vars, useColorScheme } from 'nativewind';
import type { AppSettings } from '../types';

// Define theme variable mappings
export const themeVariables = {
  light: vars({
    '--color-primary': '59 130 246', // blue-500
    '--color-primary-foreground': '255 255 255',
    '--color-secondary': '229 231 235', // gray-200
    '--color-secondary-foreground': '31 41 55', // gray-800
    '--color-accent': '139 92 246', // violet-500
    '--color-accent-foreground': '255 255 255',
    '--color-background': '255 255 255',
    '--color-foreground': '17 24 39', // gray-900
    '--color-card': '255 255 255',
    '--color-card-foreground': '31 41 55', // gray-800
    '--color-muted': '249 250 251', // gray-50
    '--color-muted-foreground': '107 114 128', // gray-500
    '--color-border': '229 231 235', // gray-200
    '--color-mood-1': '239 68 68', // red-500
    '--color-mood-2': '251 146 60', // orange-400
    '--color-mood-3': '234 179 8', // yellow-500
    '--color-mood-4': '34 197 94', // green-500
    '--color-mood-5': '16 185 129', // emerald-500
  }),

  dark: vars({
    '--color-primary': '59 130 246', // blue-500
    '--color-primary-foreground': '255 255 255',
    '--color-secondary': '55 65 81', // gray-700
    '--color-secondary-foreground': '229 231 235', // gray-200
    '--color-accent': '139 92 246', // violet-500
    '--color-accent-foreground': '255 255 255',
    '--color-background': '17 24 39', // gray-900
    '--color-foreground': '243 244 246', // gray-100
    '--color-card': '31 41 55', // gray-800
    '--color-card-foreground': '229 231 235', // gray-200
    '--color-muted': '55 65 81', // gray-700
    '--color-muted-foreground': '156 163 175', // gray-400
    '--color-border': '75 85 99', // gray-600
    '--color-mood-1': '220 38 38', // red-600
    '--color-mood-2': '234 88 12', // orange-600
    '--color-mood-3': '202 138 4', // yellow-600
    '--color-mood-4': '22 163 74', // green-600
    '--color-mood-5': '5 150 105', // emerald-600
  }),

  nature: vars({
    '--color-primary': '34 197 94', // green-500
    '--color-primary-foreground': '255 255 255',
    '--color-secondary': '220 252 231', // green-100
    '--color-secondary-foreground': '20 83 45', // green-800
    '--color-accent': '132 204 22', // lime-500
    '--color-accent-foreground': '255 255 255',
    '--color-background': '247 254 231', // lime-50
    '--color-foreground': '20 83 45', // green-800
    '--color-card': '255 255 255',
    '--color-card-foreground': '22 101 52', // green-700
    '--color-muted': '236 253 245', // green-50
    '--color-muted-foreground': '101 163 13', // lime-600
    '--color-border': '187 247 208', // green-200
    '--color-mood-1': '185 28 28', // red-700
    '--color-mood-2': '194 65 12', // orange-700
    '--color-mood-3': '161 98 7', // yellow-700
    '--color-mood-4': '21 128 61', // green-700
    '--color-mood-5': '6 95 70', // emerald-700
  }),

  ocean: vars({
    '--color-primary': '14 165 233', // sky-500
    '--color-primary-foreground': '255 255 255',
    '--color-secondary': '224 242 254', // sky-100
    '--color-secondary-foreground': '12 74 110', // sky-800
    '--color-accent': '6 182 212', // cyan-500
    '--color-accent-foreground': '255 255 255',
    '--color-background': '240 249 255', // sky-50
    '--color-foreground': '12 74 110', // sky-800
    '--color-card': '255 255 255',
    '--color-card-foreground': '7 89 133', // sky-700
    '--color-muted': '236 254 255', // cyan-50
    '--color-muted-foreground': '8 145 178', // cyan-600
    '--color-border': '186 230 253', // sky-200
    '--color-mood-1': '190 24 93', // rose-700
    '--color-mood-2': '194 65 12', // orange-700
    '--color-mood-3': '180 83 9', // amber-700
    '--color-mood-4': '21 94 117', // cyan-700
    '--color-mood-5': '12 74 110', // sky-800
  }),

  sunset: vars({
    '--color-primary': '251 146 60', // orange-400
    '--color-primary-foreground': '255 255 255',
    '--color-secondary': '254 240 138', // yellow-200
    '--color-secondary-foreground': '120 53 15', // orange-900
    '--color-accent': '244 63 94', // rose-500
    '--color-accent-foreground': '255 255 255',
    '--color-background': '255 251 235', // orange-50
    '--color-foreground': '120 53 15', // orange-900
    '--color-card': '255 255 255',
    '--color-card-foreground': '154 52 18', // orange-800
    '--color-muted': '254 243 199', // yellow-100
    '--color-muted-foreground': '217 119 6', // yellow-600
    '--color-border': '254 215 170', // orange-200
    '--color-mood-1': '190 24 93', // rose-700
    '--color-mood-2': '194 65 12', // orange-700
    '--color-mood-3': '180 83 9', // amber-700
    '--color-mood-4': '217 119 6', // yellow-600
    '--color-mood-5': '251 191 36', // yellow-400
  }),
} as const;

// Theme switching utility
export function getThemeVariables(theme: AppSettings['theme'], colorScheme?: 'light' | 'dark' | null) {
  switch (theme) {
    case 'dark':
      return themeVariables.dark;
    case 'auto':
      return colorScheme === 'dark' ? themeVariables.dark : themeVariables.light;
    case 'nature':
      return themeVariables.nature;
    case 'ocean':
      return themeVariables.ocean;
    case 'sunset':
      return themeVariables.sunset;
    case 'light':
    default:
      return themeVariables.light;
  }
}

// Hook to get current theme variables
export function useThemeVariables() {
  const { colorScheme } = useColorScheme();
  
  return {
    getThemeVariables: (theme: AppSettings['theme']) => getThemeVariables(theme, colorScheme),
    colorScheme,
  };
}