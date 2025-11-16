import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    theme,
    fontSize,
    reminderEnabled,
    reminderTime,
    loadSettings,
    updateSettings,
  } = useSettingsStore();
  const { logout, isBiometricAvailable, isBiometricEnabled, setBiometricEnabled } =
    useAuthStore();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localFontSize, setLocalFontSize] = useState(fontSize);

  useEffect(() => {
    loadSettings();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setLocalTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    setLocalFontSize(newSize);
    updateSettings({ fontSize: newSize });
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white dark:bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white px-4 pt-4 pb-2">
            Appearance
          </Text>

          <View className="px-4 pb-2">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Theme</Text>
            <View className="flex-row">
              {(['light', 'dark', 'auto'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                    localTheme === t ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  onPress={() => handleThemeChange(t)}
                >
                  <Text
                    className={`text-center font-semibold ${
                      localTheme === t ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="px-4 pb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Font Size</Text>
            <View className="flex-row">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                    localFontSize === s ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  onPress={() => handleFontSizeChange(s)}
                >
                  <Text
                    className={`text-center font-semibold ${
                      localFontSize === s ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View className="bg-white dark:bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white px-4 pt-4 pb-2">
            Security
          </Text>

          {isBiometricAvailable && (
            <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <View>
                <Text className="text-gray-900 dark:text-white font-medium">
                  Biometric Authentication
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Use fingerprint or face ID
                </Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
              />
            </View>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700"
            onPress={() => router.push('/settings/change-pin')}
          >
            <Text className="text-gray-900 dark:text-white font-medium">Change PIN</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white px-4 pt-4 pb-2">
            Notifications
          </Text>

          <View className="flex-row items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium">Daily Reminder</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Get reminded to write daily
              </Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={(value) => updateSettings({ reminderEnabled: value })}
              trackColor={{ false: '#D1D5DB', true: '#2563EB' }}
            />
          </View>
        </View>

        <TouchableOpacity
          className="bg-red-600 mx-4 mt-6 mb-8 rounded-lg py-4 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

