import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthState {
  isAuthenticated: boolean;
  isBiometricAvailable: boolean;
  isBiometricEnabled: boolean;
  pinEnabled: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  authenticateWithBiometric: () => Promise<boolean>;
  authenticateWithPin: (pin: string) => Promise<boolean>;
  setPin: (pin: string) => Promise<void>;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  logout: () => void;
}

const PIN_KEY = 'diary_pin';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isBiometricAvailable: false,
  isBiometricEnabled: false,
  pinEnabled: false,
  isLoading: true,

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
      set({ pinEnabled: true });
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

  logout: () => {
    set({ isAuthenticated: false });
  },
}));

