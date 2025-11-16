import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { database } from '../services';
import type { Tag } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface TagSelectorProps {
  entryId: string;
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
}

const tagColors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

export function TagSelector({ entryId, selectedTagIds, onTagsChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    const allTags = await database.getAllTags();
    setTags(allTags);
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    const newTag: Tag = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newTagName.trim(),
      color: tagColors[tags.length % tagColors.length],
      createdAt: new Date().toISOString(),
    };

    try {
      await database.createTag(newTag);
      await database.addTagToEntry(entryId, newTag.id);
      setTags([...tags, newTag]);
      onTagsChange([...selectedTagIds, newTag.id]);
      setNewTagName('');
      setShowCreate(false);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const toggleTag = async (tagId: string) => {
    const isSelected = selectedTagIds.includes(tagId);
    if (isSelected) {
      await database.removeTagFromEntry(entryId, tagId);
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      await database.addTagToEntry(entryId, tagId);
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">Tags</Text>
        <TouchableOpacity onPress={() => setShowCreate(!showCreate)}>
          <Ionicons
            name={showCreate ? 'close' : 'add'}
            size={20}
            color="#2563EB"
          />
        </TouchableOpacity>
      </View>

      {showCreate && (
        <View className="flex-row items-center mb-2">
          <TextInput
            className="flex-1 h-10 px-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white mr-2"
            placeholder="Tag name"
            placeholderTextColor="#9CA3AF"
            value={newTagName}
            onChangeText={setNewTagName}
            onSubmitEditing={createTag}
          />
          <TouchableOpacity
            className="bg-blue-600 rounded-lg px-4 py-2"
            onPress={createTag}
          >
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row">
          {tags.map((tag) => {
            const isSelected = selectedTagIds.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                className={`px-3 py-1 rounded-full mr-2 ${
                  isSelected ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                onPress={() => toggleTag(tag.id)}
              >
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tag.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

