import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useEntriesStore } from '../../store/useEntriesStore';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { StatusBar } from 'expo-status-bar';
import type { MoodData } from '../../types';

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const moodLabels = ['Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];

export default function MoodScreen() {
  const { entries, loadEntries } = useEntriesStore();
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    const moods: MoodData[] = entries
      .filter((e) => e.mood !== undefined && e.moodEmoji)
      .map((e) => ({
        date: e.date,
        mood: e.mood!,
        moodEmoji: e.moodEmoji!,
        entryId: e.id,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setMoodData(moods);
  }, [entries]);

  const getAverageMood = () => {
    if (moodData.length === 0) return null;
    const sum = moodData.reduce((acc, m) => acc + m.mood, 0);
    return Math.round((sum / moodData.length) * 10) / 10;
  };

  const getMoodCounts = () => {
    const counts = [0, 0, 0, 0, 0];
    moodData.forEach((m) => {
      if (m.mood >= 1 && m.mood <= 5) {
        counts[m.mood - 1]++;
      }
    });
    return counts;
  };

  const averageMood = getAverageMood();
  const moodCounts = getMoodCounts();

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar style="auto" />
      <View className="bg-white dark:bg-gray-800 pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Mood Tracking</Text>
        <View className="flex-row mt-4">
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg mr-2 ${
              selectedPeriod === 'week' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onPress={() => setSelectedPeriod('week')}
          >
            <Text
              className={`font-semibold ${
                selectedPeriod === 'week' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-lg ${
              selectedPeriod === 'month' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
            onPress={() => setSelectedPeriod('month')}
          >
            <Text
              className={`font-semibold ${
                selectedPeriod === 'month' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {moodData.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">📊</Text>
            <Text className="text-gray-500 dark:text-gray-400 text-lg">
              No mood data yet
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
              Start tracking your mood in your diary entries
            </Text>
          </View>
        ) : (
          <>
            <View className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-sm">
              <Text className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                Average Mood
              </Text>
              <View className="flex-row items-center">
                <Text className="text-4xl mr-3">
                  {averageMood ? moodEmojis[Math.round(averageMood) - 1] : '😐'}
                </Text>
                <View>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    {averageMood ? averageMood.toFixed(1) : 'N/A'}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    out of 5.0
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 shadow-sm">
              <Text className="text-gray-900 dark:text-white font-semibold mb-4">
                Mood Distribution
              </Text>
              {moodCounts.map((count, index) => (
                <View key={index} className="flex-row items-center mb-3">
                  <Text className="text-2xl w-10">{moodEmojis[index]}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 w-24">
                    {moodLabels[index]}
                  </Text>
                  <View className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full mr-2">
                    <View
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${(count / moodData.length) * 100}%`,
                      }}
                    />
                  </View>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                    {count}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <Text className="text-gray-900 dark:text-white font-semibold mb-4">
                Recent Moods
              </Text>
              {moodData.slice(-7).reverse().map((mood, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <Text className="text-2xl">{mood.moodEmoji}</Text>
                  <Text className="text-gray-600 dark:text-gray-400 flex-1 ml-3">
                    {format(new Date(mood.date), 'MMM d, yyyy')}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-500 text-sm">
                    {mood.mood}/5
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

