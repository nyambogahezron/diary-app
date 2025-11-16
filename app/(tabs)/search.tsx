import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import type { SearchFilters } from '../../types';

export default function SearchScreen() {
  const router = useRouter();
  const { searchEntries } = useEntriesStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    const filters: SearchFilters = {
      query: query || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
    const searchResults = await searchEntries(filters);
    setResults(searchResults);
  };

  const renderResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm border border-gray-200 dark:border-gray-700"
      onPress={() => router.push(`/entry/${item.id}`)}
    >
      <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {item.title || 'Untitled Entry'}
      </Text>
      <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2" numberOfLines={2}>
        {item.content.replace(/[#*\[\]]/g, '').substring(0, 150)}...
      </Text>
      <Text className="text-gray-400 dark:text-gray-500 text-xs">
        {format(new Date(item.date), 'MMM d, yyyy')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center mb-3">
          <View className="flex-1 flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3">
            <Ionicons name="search" size={20} color="#6B7280" />
            <TextInput
              className="flex-1 h-10 px-2 text-gray-900 dark:text-white"
              placeholder="Search entries..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            className="ml-2 p-2"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons
              name={showFilters ? 'filter' : 'filter-outline'}
              size={24}
              color="#2563EB"
            />
          </TouchableOpacity>
        </View>

        {showFilters && (
          <ScrollView className="mt-2">
            <View className="flex-row items-center mb-2">
              <Text className="text-sm text-gray-600 dark:text-gray-400 w-20">Start Date:</Text>
              <TextInput
                className="flex-1 h-10 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={startDate}
                onChangeText={setStartDate}
              />
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-sm text-gray-600 dark:text-gray-400 w-20">End Date:</Text>
              <TextInput
                className="flex-1 h-10 px-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={endDate}
                onChangeText={setEndDate}
              />
            </View>
            <TouchableOpacity
              className="bg-blue-600 rounded-lg py-2 px-4 items-center"
              onPress={handleSearch}
            >
              <Text className="text-white font-semibold">Apply Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      <FlatList
        data={results}
        renderItem={renderResult}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="search-outline" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 dark:text-gray-400 text-lg mt-4">
              {query ? 'No results found' : 'Start searching...'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

