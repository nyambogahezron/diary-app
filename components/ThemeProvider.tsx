import React, { createContext, useContext } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';

interface ThemeContextValue {
  theme: 'dark';
  isDark: true;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { setColorScheme } = useColorScheme();

  // Force dark mode
  React.useEffect(() => {
    setColorScheme('dark');
  }, [setColorScheme]);

  const value: ThemeContextValue = {
    theme: 'dark',
    isDark: true,
  };

  return (
    <ThemeContext.Provider value={value}>
      <View className="flex-1">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

// Hook to get theme
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