import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { themeMetadata } from '../../components/ThemeProvider';
import { MoodThemeDemo } from '../../components/MoodIndicator';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const {
    theme,
    fontSize,
    reminderEnabled,
    loadSettings,
    updateSettings,
  } = useSettingsStore();
  const { logout, isBiometricAvailable, isBiometricEnabled, setBiometricEnabled } =
    useAuthStore();
  const [localTheme, setLocalTheme] = useState(theme);
  const [localFontSize, setLocalFontSize] = useState(fontSize);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto' | 'nature' | 'ocean' | 'sunset') => {
    setLocalTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    setLocalFontSize(newSize);
    updateSettings({ fontSize: newSize });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="auto" />
      <View className="bg-card pt-12 pb-4 px-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white dark:bg-gray-800 mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white px-4 pt-4 pb-2">
            Appearance
          </Text>

          <View className="px-4 pb-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">Theme</Text>
            <View className="space-y-2">
              {/* Primary themes row */}
              <View className="flex-row justify-between">
                {(['light', 'dark', 'auto'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    className={`flex-1 py-3 px-3 rounded-lg mx-1 border-2 ${
                      localTheme === t 
                        ? 'bg-primary border-primary' 
                        : 'bg-card border-border'
                    }`}
                    onPress={() => handleThemeChange(t)}
                  >
                    <View className="items-center">
                      <Text className="text-xl mb-1">
                        {themeMetadata[t].icon}
                      </Text>
                      <Text
                        className={`text-xs font-semibold text-center ${
                          localTheme === t 
                            ? 'text-primary-foreground' 
                            : 'text-card-foreground'
                        }`}
                      >
                        {themeMetadata[t].name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Colored themes row */}
              <View className="flex-row justify-between">
                {(['nature', 'ocean', 'sunset'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    className={`flex-1 py-3 px-3 rounded-lg mx-1 border-2 ${
                      localTheme === t 
                        ? 'bg-primary border-primary' 
                        : 'bg-card border-border'
                    }`}
                    onPress={() => handleThemeChange(t)}
                  >
                    <View className="items-center">
                      <Text className="text-xl mb-1">
                        {themeMetadata[t].icon}
                      </Text>
                      <Text
                        className={`text-xs font-semibold text-center ${
                          localTheme === t 
                            ? 'text-primary-foreground' 
                            : 'text-card-foreground'
                        }`}
                      >
                        {themeMetadata[t].name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Theme description */}
              {localTheme && (
                <View className="mt-2 p-2 bg-muted rounded-lg">
                  <Text className="text-xs text-muted-foreground text-center">
                    {themeMetadata[localTheme].description}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Theme preview with mood colors */}
          <View className="px-4 pb-4">
            <MoodThemeDemo />
          </View>

          <View className="px-4 pb-4">
            <Text className="text-sm text-muted-foreground mb-2">Font Size</Text>
            <View className="flex-row">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  className={`flex-1 py-2 px-3 rounded-lg mr-2 ${
                    localFontSize === s ? 'bg-primary' : 'bg-secondary'
                  }`}
                  onPress={() => handleFontSizeChange(s)}
                >
                  <Text
                    className={`text-center font-semibold ${
                      localFontSize === s ? 'text-primary-foreground' : 'text-secondary-foreground'
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View className="bg-card mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-foreground px-4 pt-4 pb-2">
            Security
          </Text>

          {isBiometricAvailable && (
            <View className="flex-row items-center justify-between px-4 py-3 border-t border-border">
              <View>
                <Text className="text-foreground font-medium">
                  Biometric Authentication
                </Text>
                <Text className="text-sm text-muted-foreground">
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
            className="flex-row items-center justify-between px-4 py-3 border-t border-border"
            onPress={() => {
              // TODO: Implement change PIN functionality
              // router.push('/settings/change-pin')
              console.log('Change PIN functionality not yet implemented');
            }}
          >
            <Text className="text-foreground font-medium">Change PIN</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="bg-card mt-4 mx-4 rounded-lg shadow-sm">
          <Text className="text-lg font-semibold text-foreground px-4 pt-4 pb-2">
            Notifications
          </Text>

          <View className="flex-row items-center justify-between px-4 py-3 border-t border-border">
            <View>
              <Text className="text-foreground font-medium">Daily Reminder</Text>
              <Text className="text-sm text-muted-foreground">
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

