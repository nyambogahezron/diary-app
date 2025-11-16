import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format, isToday, isYesterday } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const router = useRouter();
  const { entries, loadEntries, isLoading } = useEntriesStore();
  const [recentEntries, setRecentEntries] = useState(entries.slice(0, 10));

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    setRecentEntries(entries.slice(0, 10));
  }, [entries]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  const renderEntry = ({ item }: { item: typeof entries[0] }) => (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-700"
      onPress={() => router.push(`/entry/${item.id}`)}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
          {item.title || 'Untitled Entry'}
        </Text>
        {item.isLocked && (
          <Ionicons name="lock-closed" size={16} color="#6B7280" className="ml-2" />
        )}
        {item.moodEmoji && (
          <Text className="text-xl ml-2">{item.moodEmoji}</Text>
        )}
      </View>
      <Text
        className="text-gray-600 dark:text-gray-400 text-sm mb-2"
        numberOfLines={2}
      >
        {item.content.replace(/[#*\[\]]/g, '').substring(0, 100)}...
      </Text>
      <Text className="text-gray-400 dark:text-gray-500 text-xs">
        {formatDate(item.date)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">My Diary</Text>
          <TouchableOpacity
            className="bg-blue-600 rounded-full w-10 h-10 items-center justify-center"
            onPress={() => router.push('/entry/new')}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {isLoading ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500">Loading entries...</Text>
          </View>
        ) : recentEntries.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="journal-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 text-lg mt-4 mb-2">
              No entries yet
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm text-center mb-6">
              Start writing your first diary entry
            </Text>
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-6 py-3"
              onPress={() => router.push('/entry/new')}
            >
              <Text className="text-white font-semibold">Create Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Entries
            </Text>
            <FlatList
              data={recentEntries}
              renderItem={renderEntry}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

