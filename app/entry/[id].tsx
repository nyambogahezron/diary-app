import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];

export default function EntryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEntry, updateEntry, deleteEntry, isLoading } = useEntriesStore();
  const [entry, setEntry] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | undefined>();
  const [date, setDate] = useState('');

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    if (!id) return;
    const entryData = await getEntry(id);
    if (entryData) {
      setEntry(entryData);
      setTitle(entryData.title);
      setContent(entryData.content);
      setSelectedMood(entryData.mood);
      setDate(entryData.date);
    }
  };

  const handleSave = async () => {
    if (!entry) return;
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }

    try {
      await updateEntry({
        ...entry,
        title: title.trim() || 'Untitled Entry',
        content: content.trim(),
        date,
        mood: selectedMood,
        moodEmoji: selectedMood ? moodEmojis[selectedMood - 1] : undefined,
      });
      setIsEditing(false);
      await loadEntry();
    } catch (error) {
      Alert.alert('Error', 'Failed to update entry');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEntry(id!);
            router.back();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete entry');
          }
        },
      },
    ]);
  };

  if (!entry && !isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text className="text-gray-500">Entry not found</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          {!isEditing && (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} className="mr-4">
                <Ionicons name="create-outline" size={24} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color="#EF4444" />
              </TouchableOpacity>
            </>
          )}
          {isEditing && (
            <TouchableOpacity onPress={handleSave} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <Text className="text-blue-600 font-semibold">Save</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {isEditing ? (
          <>
            <TextInput
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
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
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              style={{ minHeight: 400 }}
            />
          </>
        ) : (
          <>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {entry.title || 'Untitled Entry'}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {format(new Date(entry.date), 'MMMM d, yyyy')}
            </Text>
            {entry.moodEmoji && (
              <View className="flex-row items-center mb-4">
                <Text className="text-3xl mr-2">{entry.moodEmoji}</Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  {moodLabels[entry.mood - 1]}
                </Text>
              </View>
            )}
            <Text className="text-base text-gray-900 dark:text-white leading-6 mb-8">
              {entry.content}
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}

