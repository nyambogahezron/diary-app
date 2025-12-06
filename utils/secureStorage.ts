import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'diary_app_pin';
const BIOMETRIC_KEY = 'biometric_enabled';

export const secureStorage = {
  // PIN Management
  async setPin(pin: string): Promise<void> {
    await SecureStore.setItemAsync(PIN_KEY, pin);
  },

  async getPin(): Promise<string | null> {
    return await SecureStore.getItemAsync(PIN_KEY);
  },

  async verifyPin(pin: string): Promise<boolean> {
    const storedPin = await this.getPin();
    return storedPin === pin;
  },

  async deletePin(): Promise<void> {
    await SecureStore.deleteItemAsync(PIN_KEY);
  },

  async hasPin(): Promise<boolean> {
    const pin = await this.getPin();
    return pin !== null;
  },

  // Biometric Management
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled.toString());
  },

  async isBiometricEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
    return value === 'true';
  },

  async checkBiometricAvailability(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  },

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your diary',
        fallbackLabel: 'Use PIN instead',
        cancelLabel: 'Cancel',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  },
};
