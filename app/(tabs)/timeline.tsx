import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format, isToday, isYesterday } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function TimelineScreen() {
  const router = useRouter();
  const { entries, loadEntries, isLoading } = useEntriesStore();
  const [groupedEntries, setGroupedEntries] = useState<Record<string, typeof entries>>({});

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const grouped: Record<string, typeof entries> = {};
    entries.forEach((entry) => {
      const dateKey = entry.date.split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    setGroupedEntries(grouped);
  }, [entries]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const allDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  const renderEntry = (entry: typeof entries[0]) => (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-2 ml-8 shadow-sm border border-gray-200 dark:border-gray-700"
      onPress={() => router.push(`/entry/${entry.id}`)}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-semibold text-gray-900 dark:text-white flex-1">
          {entry.title || 'Untitled Entry'}
        </Text>
        {entry.moodEmoji && <Text className="text-xl ml-2">{entry.moodEmoji}</Text>}
      </View>
      <Text className="text-gray-600 dark:text-gray-400 text-sm" numberOfLines={2}>
        {entry.content.replace(/[#*\[\]]/g, '').substring(0, 100)}...
      </Text>
    </TouchableOpacity>
  );

  const renderDateSection = (dateKey: string) => {
    const dateEntries = groupedEntries[dateKey];
    return (
      <View key={dateKey} className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            {formatDateHeader(dateKey)}
          </Text>
          <View className="flex-1 h-px bg-gray-300 dark:bg-gray-600 ml-3" />
        </View>
        {dateEntries.map((entry) => (
          <View key={entry.id} className="relative">
            <View className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600" />
            {renderEntry(entry)}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Timeline</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Loading...</Text>
        </View>
      ) : allDates.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20">
          <Ionicons name="time-outline" size={64} color="#9CA3AF" />
          <Text className="text-gray-500 dark:text-gray-400 text-lg mt-4">
            No entries yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={allDates}
          renderItem={({ item }) => renderDateSection(item)}
          keyExtractor={(item) => item}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

