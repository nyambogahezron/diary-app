import React, { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { initializeTemplates } from '../utils/templates';
import './global.css';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { db } from '../db/connection';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import * as SystemUI from 'expo-system-ui';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { checkAuth } = useAuthStore();
  const { loadSettings } = useSettingsStore();
  const { success, error } = useMigrations(db, migrations);
  const [appIsReady, setAppIsReady] = useState(false);

  if (error) {
    console.error('Migration error:', error);
  }

  useDrizzleStudio(db.$client);

  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync('transparent');
    } else {
      SystemUI.setBackgroundColorAsync('#e2e8f0');
    }
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts if needed
        // await Font.loadAsync({
        //   Inter_400Regular: require('../assets/fonts/Inter-Regular.ttf'),
        //   Inter_600SemiBold: require('../assets/fonts/Inter-SemiBold.ttf'),
        //   Inter_700Bold: require('../assets/fonts/Inter-Bold.ttf'),
        // });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && success) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, success]);

  useEffect(() => {
    const init = async () => {
      try {
        if (success) {
          await initializeTemplates();
          await checkAuth();
          await loadSettings();
          onLayoutRootView();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    if (success) {
      init();
    }
  }, [success, checkAuth, loadSettings, onLayoutRootView]);

  if (!appIsReady || !success) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="entry/[id]" />
        <Stack.Screen name="entry/new" />
      </Stack>
    </SafeAreaProvider>
  );
}
