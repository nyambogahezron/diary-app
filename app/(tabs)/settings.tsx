import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useSettingsStore } from '../../store/useSettingsStore';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { PinSetupModal } from '../../components/PinSetupModal';
import { secureStorage } from '../../utils/secureStorage';

export default function SettingsScreen() {
  const {
    fontSize,
    biometricEnabled,
    pinEnabled,
    reminderEnabled,
    loadSettings,
    updateSettings,
  } = useSettingsStore();
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'setup' | 'change'>('setup');
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(false);

  useEffect(() => {
    loadSettings();
    checkSecurityFeatures();
  }, [loadSettings]);

  const checkSecurityFeatures = async () => {
    const bioAvailable = await secureStorage.checkBiometricAvailability();
    const pinExists = await secureStorage.hasPin();
    setIsBiometricAvailable(bioAvailable);
    setHasPinSet(pinExists);
  };

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    setLocalFontSize(newSize);
    updateSettings({ fontSize: newSize });
  };

  const handleSetupPin = () => {
    setPinModalMode('setup');
    setShowPinModal(true);
  };

  const handleChangePin = () => {
    setPinModalMode('change');
    setShowPinModal(true);
  };

  const handleRemovePin = () => {
    Alert.alert(
      'Remove PIN',
      'Are you sure you want to remove your PIN? This will also disable biometric authentication.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await secureStorage.deletePin();
              await secureStorage.setBiometricEnabled(false);
              await updateSettings({ pinEnabled: false, biometricEnabled: false });
              setHasPinSet(false);
              Alert.alert('Success', 'PIN has been removed');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove PIN');
            }
          },
        },
      ]
    );
  };

  const handlePinSuccess = async () => {
    await updateSettings({ pinEnabled: true });
    await checkSecurityFeatures();
  };

  const handleBiometricToggle = async (enabled: boolean) => {
    if (!hasPinSet) {
      Alert.alert('PIN Required', 'Please set up a PIN first before enabling biometric authentication.');
      return;
    }

    if (!isBiometricAvailable) {
      Alert.alert('Not Available', 'Biometric authentication is not available on this device.');
      return;
    }

    try {
      await secureStorage.setBiometricEnabled(enabled);
      await updateSettings({ biometricEnabled: enabled });
    } catch (error) {
      Alert.alert('Error', 'Failed to update biometric settings');
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <StatusBar style="light" />
      <View className="bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-700">
        <Text className="text-2xl font-bold text-white">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        {/* Appearance Section */}
        <View className="bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-white px-4 pt-4 pb-2">
            Appearance
          </Text>

          <View className="px-4 py-3 border-t border-gray-700">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-medium">Theme</Text>
              <View className="flex-row items-center">
                <Ionicons name="moon" size={20} color="#3B82F6" />
                <Text className="text-gray-400 ml-2">Dark Mode</Text>
              </View>
            </View>
            <Text className="text-sm text-gray-400">
              App is set to dark theme for better viewing experience
            </Text>
          </View>

          <View className="px-4 pb-4 border-t border-gray-700">
            <Text className="text-white font-medium mb-3 mt-3">Font Size</Text>
            <View className="flex-row">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                    localFontSize === s ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                  onPress={() => handleFontSizeChange(s)}
                >
                  <Text
                    className={`text-center font-semibold ${
                      localFontSize === s ? 'text-white' : 'text-gray-300'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View className="bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-white px-4 pt-4 pb-2">
            Security & Privacy
          </Text>

          {/* PIN Section */}
          <View className="px-4 py-3 border-t border-gray-700">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-medium">PIN Protection</Text>
                <Text className="text-sm text-gray-400">
                  {hasPinSet ? 'PIN is active' : 'Secure your diary with a PIN'}
                </Text>
              </View>
              {hasPinSet ? (
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className="bg-gray-700 rounded-lg px-3 py-2"
                    onPress={handleChangePin}
                  >
                    <Text className="text-blue-400 font-medium">Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-700 rounded-lg px-3 py-2"
                    onPress={handleRemovePin}
                  >
                    <Text className="text-red-400 font-medium">Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="bg-blue-600 rounded-lg px-4 py-2"
                  onPress={handleSetupPin}
                >
                  <Text className="text-white font-medium">Set PIN</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Biometric Section */}
          {isBiometricAvailable && (
            <View className="px-4 py-3 border-t border-gray-700">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white font-medium">Biometric Authentication</Text>
                  <Text className="text-sm text-gray-400">
                    {hasPinSet
                      ? 'Use fingerprint or face ID to unlock'
                      : 'Set up a PIN first to enable biometrics'}
                  </Text>
                </View>
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  disabled={!hasPinSet}
                  trackColor={{ false: '#4B5563', true: '#3B82F6' }}
                  thumbColor={biometricEnabled ? '#ffffff' : '#9CA3AF'}
                />
              </View>
            </View>
          )}
        </View>

        {/* Notifications Section */}
        <View className="bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm mb-8">
          <Text className="text-lg font-semibold text-white px-4 pt-4 pb-2">
            Notifications
          </Text>

          <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-700">
            <View className="flex-1">
              <Text className="text-white font-medium">Daily Reminder</Text>
              <Text className="text-sm text-gray-400">
                Get reminded to write daily
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={(value) => updateSettings({ reminderEnabled: value })}
              trackColor={{ false: '#4B5563', true: '#3B82F6' }}
              thumbColor={reminderEnabled ? '#ffffff' : '#9CA3AF'}
            />
          </View>
        </View>
      </ScrollView>

      <PinSetupModal
        visible={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        mode={pinModalMode}
      />
    </View>
  );
}

