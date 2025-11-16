import React from 'react';
import { View, Text } from 'react-native';

interface MoodIndicatorProps {
  mood: 1 | 2 | 3 | 4 | 5;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const moodLabels = {
  1: 'Very Sad',
  2: 'Sad',
  3: 'Neutral', 
  4: 'Happy',
  5: 'Very Happy',
};

const moodEmojis = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '😊',
  5: '😄',
};

export function MoodIndicator({ mood, size = 'medium', showLabel = false }: MoodIndicatorProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12',
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  const moodColorClass = `bg-mood-${mood}`;

  return (
    <View className="items-center">
      <View className={`${sizeClasses[size]} ${moodColorClass} rounded-full items-center justify-center`}>
        <Text className={`${textSizeClasses[size]}`}>
          {moodEmojis[mood]}
        </Text>
      </View>
      {showLabel && (
        <Text className={`${textSizeClasses[size]} text-muted-foreground mt-1`}>
          {moodLabels[mood]}
        </Text>
      )}
    </View>
  );
}

// Mood selector component for theme demonstration
export function MoodThemeDemo() {
  return (
    <View className="bg-card p-4 rounded-lg">
      <Text className="text-foreground font-semibold mb-3 text-center">
        Mood Colors in Current Theme
      </Text>
      <View className="flex-row justify-around">
        {([1, 2, 3, 4, 5] as const).map((mood) => (
          <MoodIndicator 
            key={mood} 
            mood={mood} 
            size="medium" 
            showLabel 
          />
        ))}
      </View>
    </View>
  );
}