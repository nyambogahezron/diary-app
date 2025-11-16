import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthState {
  isAuthenticated: boolean;
  isBiometricAvailable: boolean;
  isBiometricEnabled: boolean;
  pinEnabled: boolean;
  isLoading: boolean;
  hasSeenOnboarding: boolean;
  checkAuth: () => Promise<void>;
  checkOnboarding: () => Promise<boolean>;
  markOnboardingComplete: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  authenticateWithPin: (pin: string) => Promise<boolean>;
  setPin: (pin: string) => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  logout: () => void;
  // Auto-authenticate if session is valid
  tryAutoAuthenticate: () => Promise<boolean>;
}

const PIN_KEY = 'diary_pin';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const ONBOARDING_KEY = 'has_seen_onboarding';
const SESSION_KEY = 'auth_session';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isBiometricAvailable: false,
  isBiometricEnabled: false,
  pinEnabled: false,
  isLoading: true,
  hasSeenOnboarding: false,

  checkOnboarding: async () => {
    try {
      const hasSeenOnboarding = await SecureStore.getItemAsync(ONBOARDING_KEY);
      const seen = hasSeenOnboarding === 'true';
      set({ hasSeenOnboarding: seen });
      return seen;
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  },

  markOnboardingComplete: async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      set({ hasSeenOnboarding: true });
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      throw error;
    }
  },

  tryAutoAuthenticate: async () => {
    try {
      const sessionData = await SecureStore.getItemAsync(SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        
        // Check if session is still valid
        if (session.timestamp && (now - session.timestamp) < SESSION_TIMEOUT) {
          set({ isAuthenticated: true });
          return true;
        } else {
          // Session expired, remove it
          await SecureStore.deleteItemAsync(SESSION_KEY);
        }
      }
      return false;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const [pin, biometricEnabled, hasHardware, isEnrolled] = await Promise.all([
        SecureStore.getItemAsync(PIN_KEY),
        SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY),
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      set({
        pinEnabled: !!pin,
        isBiometricAvailable: hasHardware && isEnrolled,
        isBiometricEnabled: biometricEnabled === 'true',
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ isLoading: false });
    }
  },

  authenticateWithBiometric: async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your diary',
        fallbackLabel: 'Use PIN',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        // Create session
        const session = { timestamp: Date.now() };
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },

  authenticateWithPin: async (pin: string) => {
    try {
      const storedPin = await SecureStore.getItemAsync(PIN_KEY);
      if (storedPin === pin) {
        // Create session
        const session = { timestamp: Date.now() };
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
        set({ isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('PIN authentication error:', error);
      return false;
    }
  },

  setPin: async (pin: string) => {
    try {
      await SecureStore.setItemAsync(PIN_KEY, pin);
      // Create session after setting PIN (during setup)
      const session = { timestamp: Date.now() };
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
      set({ pinEnabled: true, isAuthenticated: true });
    } catch (error) {
      console.error('Error setting PIN:', error);
      throw error;
    }
  },

  setBiometricEnabled: async (enabled: boolean) => {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled.toString());
      set({ isBiometricEnabled: enabled });
    } catch (error) {
      console.error('Error setting biometric:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Clear session
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
    set({ isAuthenticated: false });
  },
}));

