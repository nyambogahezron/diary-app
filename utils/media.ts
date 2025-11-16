import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { database } from '../services';
import type { MediaAttachment } from '../types';

export async function pickImage(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

export async function pickVideo(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking video:', error);
    return null;
  }
}

export async function pickDocument(): Promise<string | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking document:', error);
    return null;
  }
}

export async function saveMediaAttachment(
  entryId: string,
  uri: string,
  type: 'image' | 'video' | 'audio' | 'file'
): Promise<MediaAttachment | null> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      return null;
    }

    const fileName = uri.split('/').pop() || 'attachment';
    const fileSize = fileInfo.size || 0;

    // Determine MIME type
    let mimeType = 'application/octet-stream';
    if (type === 'image') {
      mimeType = 'image/jpeg';
    } else if (type === 'video') {
      mimeType = 'video/mp4';
    } else if (type === 'audio') {
      mimeType = 'audio/mpeg';
    }

    const media: MediaAttachment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      entryId,
      type,
      uri,
      fileName,
      fileSize,
      mimeType,
      createdAt: new Date().toISOString(),
    };

    await database.createMediaAttachment(media);
    return media;
  } catch (error) {
    console.error('Error saving media attachment:', error);
    return null;
  }
}

