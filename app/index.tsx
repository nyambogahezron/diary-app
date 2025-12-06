import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  useEffect(() => {
    // Redirect to main app immediately
    router.replace('/(tabs)');
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#6C5CE7" />
    </View>
  );
}
