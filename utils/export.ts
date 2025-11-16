import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { database } from '../services';
import type { DiaryEntry } from '../types';
import { format } from 'date-fns';

export async function exportEntryToMarkdown(entry: DiaryEntry): Promise<string> {
  let markdown = `# ${entry.title || 'Untitled Entry'}\n\n`;
  markdown += `**Date:** ${format(new Date(entry.date), 'MMMM d, yyyy')}\n\n`;
  if (entry.moodEmoji) {
    markdown += `**Mood:** ${entry.moodEmoji} (${entry.mood}/5)\n\n`;
  }
  markdown += `${entry.content}\n\n`;
  markdown += `---\n`;
  markdown += `*Created: ${format(new Date(entry.createdAt), 'MMMM d, yyyy HH:mm')}*\n`;
  markdown += `*Updated: ${format(new Date(entry.updatedAt), 'MMMM d, yyyy HH:mm')}*\n`;
  return markdown;
}

export async function exportAllEntriesToMarkdown(): Promise<string> {
  const entries = await database.getAllEntries();
  let markdown = '# Diary Export\n\n';
  markdown += `*Exported on ${format(new Date(), 'MMMM d, yyyy HH:mm')}*\n\n`;
  markdown += `---\n\n`;

  for (const entry of entries) {
    markdown += await exportEntryToMarkdown(entry);
    markdown += '\n\n';
  }

  return markdown;
}

export async function exportToFile(content: string, filename: string): Promise<void> {
  try {
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('Sharing not available');
    }
  } catch (error) {
    console.error('Error exporting file:', error);
    throw error;
  }
}

export async function exportToPDF(entry: DiaryEntry): Promise<void> {
  // PDF export would require additional libraries like react-native-pdf or expo-print
  // This is a placeholder for the functionality
  const markdown = await exportEntryToMarkdown(entry);
  await exportToFile(markdown, `${entry.id}.md`);
}

