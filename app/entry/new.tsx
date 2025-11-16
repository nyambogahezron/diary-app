import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];

export default function NewEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { createEntry, isLoading } = useEntriesStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | undefined>();
  const [date, setDate] = useState(params.date ? params.date as string : format(new Date(), 'yyyy-MM-dd'));

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    try {
      await createEntry({
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        date,
        mood: selectedMood,
        moodEmoji: selectedMood ? moodEmojis[selectedMood - 1] : undefined,
        isLocked: false,
        isVault: false,
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">New Entry</Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Text className="text-blue-600 font-semibold">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        <TextInput
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
          placeholder="Title (optional)"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />

        <View className="mb-4">
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Date</Text>
          <TextInput
            className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View className="mb-4">
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mood</Text>
          <View className="flex-row justify-between">
            {moodEmojis.map((emoji, index) => {
              const moodValue = index + 1;
              return (
                <TouchableOpacity
                  key={moodValue}
                  className={`flex-1 items-center py-3 rounded-lg mr-2 last:mr-0 ${
                    selectedMood === moodValue
                      ? 'bg-blue-100 dark:bg-blue-900'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                  onPress={() => setSelectedMood(selectedMood === moodValue ? undefined : moodValue)}
                >
                  <Text className="text-3xl mb-1">{emoji}</Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {moodLabels[index]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TextInput
          className="text-base text-gray-900 dark:text-white mb-4 min-h-[400px]"
          placeholder="Start writing..."
          placeholderTextColor="#9CA3AF"
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          style={{ minHeight: 400 }}
        />

        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity className="flex-row items-center py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Ionicons name="image-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700 dark:text-gray-300">Add Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Ionicons name="mic-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700 dark:text-gray-300">Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Ionicons name="attach-outline" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-700 dark:text-gray-300">File</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

