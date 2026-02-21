import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface DateTimePickerComponentProps {
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  label?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

export default function DateTimePickerComponent({
  value,
  onChange,
  mode = 'date',
  label,
  minimumDate,
  maximumDate,
}: DateTimePickerComponentProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) {
        setTempDate(selectedDate);
        onChange(selectedDate);
      }
    } else {
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShow(false);
  };

  const formatDisplay = (date: Date) => {
    switch (mode) {
      case 'date':
        return format(date, 'MMMM dd, yyyy');
      case 'time':
        return format(date, 'hh:mm a');
      case 'datetime':
        return format(date, 'MMMM dd, yyyy hh:mm a');
      default:
        return format(date, 'MMMM dd, yyyy');
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'time':
        return 'time-outline';
      case 'datetime':
        return 'calendar-outline';
      default:
        return 'calendar-outline';
    }
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</Text>
      )}
      <TouchableOpacity
        className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 flex-row items-center justify-between"
        onPress={() => setShow(true)}
      >
        <View className="flex-row items-center flex-1">
          <Ionicons
            name={getIcon() as any}
            size={20}
            color={isDark ? '#9CA3AF' : '#6B7280'}
            style={{ marginRight: 8 }}
          />
          <Text className="text-gray-900 dark:text-white text-base">
            {formatDisplay(value)}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDark ? '#9CA3AF' : '#6B7280'}
        />
      </TouchableOpacity>

      {show && (
        <>
          {Platform.OS === 'ios' && (
            <View className="bg-white dark:bg-gray-800 rounded-lg mt-2 p-4">
              <DateTimePicker
                value={tempDate}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant={isDark ? 'dark' : 'light'}
                textColor={isDark ? '#F3F4F6' : '#1F2937'}
              />
              <View className="flex-row justify-end mt-4 space-x-2">
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 mr-2"
                  onPress={handleCancel}
                >
                  <Text className="text-gray-900 dark:text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg bg-blue-600"
                  onPress={handleConfirm}
                >
                  <Text className="text-white font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {Platform.OS === 'android' && (
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="default"
              onChange={handleChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              themeVariant={isDark ? 'dark' : 'light'}
            />
          )}
        </>
      )}
    </View>
  );
}
