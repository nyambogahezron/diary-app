import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBar } from 'expo-status-bar';

export default function SetupScreen() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const router = useRouter();
  const { setPin: savePin, setBiometricEnabled: saveBiometricEnabled, isBiometricAvailable } = useAuthStore();

  const handleSetup = async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'PIN must be at least 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'The PINs do not match. Please try again.');
      setConfirmPin('');
      return;
    }

    try {
      await savePin(pin);
      if (biometricEnabled && isBiometricAvailable) {
        await saveBiometricEnabled(true);
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to set up security. Please try again.');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 px-6">
      <StatusBar style="auto" />
      <Text className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Set Up Security
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 mb-8 text-center">
        Create a PIN to protect your diary entries
      </Text>

      <View className="w-full max-w-xs">
        <TextInput
          className="w-full h-14 px-4 mb-4 text-center text-2xl font-semibold bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
          value={pin}
          onChangeText={setPin}
          placeholder="Enter PIN"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
        />

        <TextInput
          className="w-full h-14 px-4 mb-6 text-center text-2xl font-semibold bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white"
          value={confirmPin}
          onChangeText={setConfirmPin}
          placeholder="Confirm PIN"
          placeholderTextColor="#9CA3AF"
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
        />

        {isBiometricAvailable && (
          <TouchableOpacity
            className={`w-full h-14 mb-4 rounded-lg items-center justify-center border-2 ${
              biometricEnabled
                ? 'bg-blue-600 border-blue-600'
                : 'bg-transparent border-gray-300 dark:border-gray-600'
            }`}
            onPress={() => setBiometricEnabled(!biometricEnabled)}
          >
            <Text
              className={`text-lg font-semibold ${
                biometricEnabled ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {biometricEnabled ? '✓ Enable Biometric' : 'Enable Biometric'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          className="w-full h-14 bg-blue-600 rounded-lg items-center justify-center"
          onPress={handleSetup}
          disabled={!pin || !confirmPin}
        >
          <Text className="text-white text-lg font-semibold">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

