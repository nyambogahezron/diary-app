import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage } from '../utils/secureStorage';

interface PinSetupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'setup' | 'change';
}

export function PinSetupModal({ visible, onClose, onSuccess, mode }: PinSetupModalProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'current' | 'new' | 'confirm'>('current');

  const resetState = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setStep(mode === 'change' ? 'current' : 'new');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // If changing PIN, verify current PIN first
      if (mode === 'change' && step === 'current') {
        const isValid = await secureStorage.verifyPin(currentPin);
        if (!isValid) {
          Alert.alert('Error', 'Current PIN is incorrect');
          setCurrentPin('');
          setIsLoading(false);
          return;
        }
        setStep('new');
        setIsLoading(false);
        return;
      }

      // Validate new PIN
      if (step === 'new') {
        if (newPin.length < 4) {
          Alert.alert('Error', 'PIN must be at least 4 digits');
          setIsLoading(false);
          return;
        }
        setStep('confirm');
        setIsLoading(false);
        return;
      }

      // Confirm and save PIN
      if (step === 'confirm') {
        if (newPin !== confirmPin) {
          Alert.alert('Error', 'PINs do not match');
          setConfirmPin('');
          setIsLoading(false);
          return;
        }

        await secureStorage.setPin(newPin);
        Alert.alert(
          'Success',
          mode === 'setup' ? 'PIN has been set successfully' : 'PIN has been changed successfully'
        );
        resetState();
        onSuccess();
        onClose();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
      console.error('PIN save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'setup') return 'Set Up PIN';
    if (step === 'current') return 'Enter Current PIN';
    if (step === 'new') return 'Enter New PIN';
    return 'Confirm New PIN';
  };

  const getPlaceholder = () => {
    if (mode === 'change' && step === 'current') return 'Current PIN';
    if (step === 'new') return 'New PIN (min 4 digits)';
    return 'Confirm PIN';
  };

  const getCurrentValue = () => {
    if (mode === 'change' && step === 'current') return currentPin;
    if (step === 'new') return newPin;
    return confirmPin;
  };

  const handleChange = (value: string) => {
    if (mode === 'change' && step === 'current') setCurrentPin(value);
    else if (step === 'new') setNewPin(value);
    else setConfirmPin(value);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-gray-900 rounded-t-3xl px-6 py-8">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-white">{getTitle()}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-gray-400 mb-4">
              {mode === 'setup'
                ? 'Create a PIN to secure your diary entries'
                : step === 'current'
                ? 'Enter your current PIN to continue'
                : step === 'new'
                ? 'Enter a new PIN (minimum 4 digits)'
                : 'Re-enter your new PIN to confirm'}
            </Text>

            <TextInput
              className="bg-gray-800 text-white text-2xl text-center rounded-xl px-4 py-4 mb-4"
              placeholder={getPlaceholder()}
              placeholderTextColor="#6B7280"
              value={getCurrentValue()}
              onChangeText={handleChange}
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
              autoFocus
            />

            {/* PIN dots indicator */}
            <View className="flex-row justify-center space-x-3 mb-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i <= getCurrentValue().length ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </View>
          </View>

          <TouchableOpacity
            className={`rounded-xl py-4 mb-4 ${
              isLoading ? 'bg-gray-700' : 'bg-blue-600'
            }`}
            onPress={handleSubmit}
            disabled={isLoading || getCurrentValue().length < 4}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {step === 'confirm' ? (mode === 'setup' ? 'Set PIN' : 'Change PIN') : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>

          {mode === 'change' && step !== 'current' && (
            <TouchableOpacity
              className="py-3"
              onPress={() => {
                setNewPin('');
                setConfirmPin('');
                setStep('current');
              }}
            >
              <Text className="text-gray-400 text-center">Go Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
