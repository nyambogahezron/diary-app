import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThemeWrapper } from '../components/ThemeWrapper';
import { useTheme } from '../components/ThemeProvider';

// Example component showing NativeWind dynamic theming usage
export function ThemeExamples() {
  const { currentTheme } = useTheme();

  return (
    <View className="p-4 bg-background">
      <Text className="text-2xl font-bold text-foreground mb-6">
        NativeWind Dynamic Theming Examples
      </Text>

      {/* Basic theming using CSS variables */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">
          Basic CSS Variable Usage
        </Text>
        <View className="bg-card p-4 rounded-lg border border-border mb-3">
          <Text className="text-card-foreground font-medium mb-2">
            Card with theme variables
          </Text>
          <Text className="text-muted-foreground">
            This card automatically adapts to the current theme using CSS variables
          </Text>
        </View>

        <TouchableOpacity className="bg-primary p-3 rounded-lg mb-3">
          <Text className="text-primary-foreground font-medium text-center">
            Primary Button
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-secondary p-3 rounded-lg">
          <Text className="text-secondary-foreground font-medium text-center">
            Secondary Button
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mood indicators using theme variables */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">
          Mood Indicators
        </Text>
        <View className="flex-row justify-between">
          {[1, 2, 3, 4, 5].map((mood) => (
            <View
              key={mood}
              className={`w-12 h-12 rounded-full bg-mood-${mood} items-center justify-center`}
            >
              <Text className="text-white font-bold">{mood}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Nested theming examples */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">
          Nested Theme Examples
        </Text>
        
        {/* Nature theme wrapper */}
        <ThemeWrapper theme="nature" style={{ marginBottom: 12 }}>
          <View className="bg-card p-4 rounded-lg border border-border">
            <Text className="text-card-foreground font-medium mb-2">
              🌿 Nature Theme Section
            </Text>
            <Text className="text-muted-foreground">
              This section uses nature theme regardless of global theme
            </Text>
            <TouchableOpacity className="bg-primary p-2 rounded mt-2">
              <Text className="text-primary-foreground text-center font-medium">
                Nature Button
              </Text>
            </TouchableOpacity>
          </View>
        </ThemeWrapper>

        {/* Ocean theme wrapper */}
        <ThemeWrapper theme="ocean" style={{ marginBottom: 12 }}>
          <View className="bg-card p-4 rounded-lg border border-border">
            <Text className="text-card-foreground font-medium mb-2">
              🌊 Ocean Theme Section
            </Text>
            <Text className="text-muted-foreground">
              This section uses ocean theme regardless of global theme
            </Text>
            <TouchableOpacity className="bg-primary p-2 rounded mt-2">
              <Text className="text-primary-foreground text-center font-medium">
                Ocean Button
              </Text>
            </TouchableOpacity>
          </View>
        </ThemeWrapper>

        {/* Sunset theme wrapper */}
        <ThemeWrapper theme="sunset">
          <View className="bg-card p-4 rounded-lg border border-border">
            <Text className="text-card-foreground font-medium mb-2">
              🌅 Sunset Theme Section
            </Text>
            <Text className="text-muted-foreground">
              This section uses sunset theme regardless of global theme
            </Text>
            <TouchableOpacity className="bg-primary p-2 rounded mt-2">
              <Text className="text-primary-foreground text-center font-medium">
                Sunset Button
              </Text>
            </TouchableOpacity>
          </View>
        </ThemeWrapper>
      </View>

      {/* Direct CSS variable usage */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-foreground mb-3">
          Direct CSS Variable Usage
        </Text>
        <View className="space-y-2">
          <View className="p-3 rounded-lg" style={{ backgroundColor: 'rgb(var(--color-accent))' }}>
            <Text style={{ color: 'rgb(var(--color-accent-foreground))' }}>
              Using CSS variables directly in style prop
            </Text>
          </View>
          <Text className="text-[--color-primary]">
            Using CSS variable as arbitrary value in className
          </Text>
        </View>
      </View>

      <View className="bg-muted p-4 rounded-lg">
        <Text className="text-muted-foreground text-sm">
          Current theme: <Text className="font-medium">{currentTheme}</Text>
        </Text>
        <Text className="text-muted-foreground text-xs mt-1">
          All colors automatically adapt when theme changes
        </Text>
      </View>
    </View>
  );
}