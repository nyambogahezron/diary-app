import React from 'react';
import { View } from 'react-native';
import { useThemeVariables } from '../utils/nativewind-theme';
import type { AppSettings } from '../types';

interface ThemeWrapperProps {
  theme: AppSettings['theme'];
  children: React.ReactNode;
  style?: any;
}

// Individual theme components for nested theming
export function ThemeWrapper({ theme, children, style }: ThemeWrapperProps) {
  const { getThemeVariables } = useThemeVariables();
  const themeVars = getThemeVariables(theme);
  
  return (
    <View style={[themeVars, style]}>
      {children}
    </View>
  );
}