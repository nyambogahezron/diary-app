import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const router = useRouter();
  const {
    isAuthenticated,
    isBiometricAvailable,
    isBiometricEnabled,
    pinEnabled,
    isLoading: authLoading,
    authenticateWithBiometric,
    authenticateWithPin,
    checkAuth,
    checkOnboarding,
    tryAutoAuthenticate,
  } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if user has seen onboarding
        const hasCompleted = await checkOnboarding();
        if (!hasCompleted) {
          router.replace('/(auth)/onboarding');
          return;
        }

        // Check auth capabilities (PIN, biometric)
        await checkAuth();
        
        // Try to auto-authenticate with existing session
        const autoAuthSuccess = await tryAutoAuthenticate();
        
        if (autoAuthSuccess) {
          router.replace('/(tabs)');
          return;
        }
        
        setCheckingOnboarding(false);
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setCheckingOnboarding(false);
      }
    };

    initializeAuth();
  }, [checkOnboarding, checkAuth, tryAutoAuthenticate, router]);

  useEffect(() => {
    if (checkingOnboarding || authLoading) return;
    
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else if (!pinEnabled) {
      // No PIN set up, redirect to setup
      router.replace('/(auth)/setup');
    }
  }, [isAuthenticated, pinEnabled, authLoading, checkingOnboarding, router]);

  const handleBiometric = async () => {
    setIsLoading(true);
    const success = await authenticateWithBiometric();
    setIsLoading(false);
    if (!success) {
      Alert.alert('Authentication Failed', 'Biometric authentication failed. Please try again.');
    }
  };

  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits');
      return;
    }
    setIsLoading(true);
    const success = await authenticateWithPin(pin);
    setIsLoading(false);
    if (!success) {
      Alert.alert('Invalid PIN', 'The PIN you entered is incorrect.');
      setPin('');
    }
  };

  if (authLoading || checkingOnboarding) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-6">
      <StatusBar style="auto" />
      <Text className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Diary</Text>
      <Text className="text-gray-600 dark:text-gray-400 mb-8">Enter your PIN to continue</Text>

      <View className="w-full max-w-xs">
        <TextInput
          className="w-full h-14 px-4 mb-4 text-center text-2xl font-semibold bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
          value={pin}
          onChangeText={setPin}
          placeholder="PIN"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity
          className="w-full h-14 bg-blue-600 rounded-lg items-center justify-center mb-4"
          onPress={handlePinSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Unlock</Text>
          )}
        </TouchableOpacity>

        {isBiometricAvailable && isBiometricEnabled && (
          <TouchableOpacity
            className="w-full h-14 bg-gray-200 dark:bg-gray-700 rounded-lg items-center justify-center"
            onPress={handleBiometric}
            disabled={isLoading}
          >
            <Text className="text-gray-900 dark:text-white text-lg font-semibold">
              Use Biometric
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

