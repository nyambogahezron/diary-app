import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format } from 'date-fns';
import { StatusBar } from 'expo-status-bar';

export default function CalendarScreen() {
  const router = useRouter();
  const { entries, getEntriesByDate } = useEntriesStore();
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const marked: Record<string, any> = {};
    entries.forEach((entry) => {
      const dateKey = entry.date.split('T')[0];
      if (marked[dateKey]) {
        marked[dateKey].dots = [...(marked[dateKey].dots || []), { color: '#2563EB' }];
        marked[dateKey].marked = true;
      } else {
        marked[dateKey] = {
          marked: true,
          dots: [{ color: '#2563EB' }],
          selected: dateKey === selectedDate,
        };
      }
    });
    if (marked[selectedDate]) {
      marked[selectedDate].selected = true;
      marked[selectedDate].selectedColor = '#2563EB';
    } else {
      marked[selectedDate] = { selected: true, selectedColor: '#2563EB' };
    }
    setMarkedDates(marked);
  }, [entries, selectedDate]);

  const onDayPress = async (day: DateData) => {
    setSelectedDate(day.dateString);
    const dayEntries = await getEntriesByDate(day.dateString);
    if (dayEntries.length > 0) {
      router.push(`/entry/${dayEntries[0].id}`);
    } else {
      router.push({
        pathname: '/entry/new',
        params: { date: day.dateString },
      });
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</Text>
      </View>
      <Calendar
        current={selectedDate}
        markedDates={markedDates}
        onDayPress={onDayPress}
        markingType="multi-dot"
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#6B7280',
          selectedDayBackgroundColor: '#2563EB',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2563EB',
          dayTextColor: '#1F2937',
          textDisabledColor: '#D1D5DB',
          dotColor: '#2563EB',
          selectedDotColor: '#ffffff',
          arrowColor: '#2563EB',
          monthTextColor: '#1F2937',
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
        style={{
          paddingTop: 20,
        }}
      />
    </View>
  );
}

