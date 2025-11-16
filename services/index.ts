import { eq, and, desc, asc, between, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import {
  entries,
  tags,
  entryTags,
  mediaAttachments,
  templates,
  reminders,
  settings,
  stats,
  coins,
} from '../db/schema';
import type {
  DiaryEntry,
  Tag,
  MediaAttachment,
  Template,
  Reminder,
} from '../types';

// Cache for frequently accessed data
let coinCache: {
  amount: number;
  timestamp: number;
  welcomeBonus: boolean;
} | null = null;

let statsCache: {
  gamesPlayed: number;
  gamesWon: number;
  highestScore: number;
  totalScore: number;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 5000; // 5 seconds cache


export const createEntry = async (entry: DiaryEntry): Promise<void> => {
  await db.insert(entries).values({
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    mood: entry.mood || null,
    moodEmoji: entry.moodEmoji || null,
    isLocked: entry.isLocked,
    isVault: entry.isVault,
    templateId: entry.templateId || null,
  });
};

export const getEntry = async (id: string): Promise<DiaryEntry | null> => {
  const result = await db.select().from(entries).where(eq(entries.id, id)).limit(1);
  if (result.length === 0) return null;

  const entry = result[0];
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    mood: entry.mood || undefined,
    moodEmoji: entry.moodEmoji || undefined,
    isLocked: entry.isLocked,
    isVault: entry.isVault,
    templateId: entry.templateId || undefined,
  };
};

export const getAllEntries = async (): Promise<DiaryEntry[]> => {
  const result = await db
    .select()
    .from(entries)
    .orderBy(desc(entries.date), desc(entries.createdAt));

  return result.map((entry) => ({
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    mood: entry.mood || undefined,
    moodEmoji: entry.moodEmoji || undefined,
    isLocked: entry.isLocked,
    isVault: entry.isVault,
    templateId: entry.templateId || undefined,
  }));
};

export const getEntriesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<DiaryEntry[]> => {
  const result = await db
    .select()
    .from(entries)
    .where(between(entries.date, startDate, endDate))
    .orderBy(desc(entries.date));

  return result.map((entry) => ({
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    mood: entry.mood || undefined,
    moodEmoji: entry.moodEmoji || undefined,
    isLocked: entry.isLocked,
    isVault: entry.isVault,
    templateId: entry.templateId || undefined,
  }));
};

export const searchEntries = async (query: string): Promise<DiaryEntry[]> => {
  const searchTerm = `%${query}%`;
  const result = await db
    .select()
    .from(entries)
    .where(
      sql`${entries.title} LIKE ${searchTerm} OR ${entries.content} LIKE ${searchTerm}`
    )
    .orderBy(desc(entries.date));

  return result.map((entry) => ({
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    mood: entry.mood || undefined,
    moodEmoji: entry.moodEmoji || undefined,
    isLocked: entry.isLocked,
    isVault: entry.isVault,
    templateId: entry.templateId || undefined,
  }));
};

export const updateEntry = async (entry: DiaryEntry): Promise<void> => {
  await db
    .update(entries)
    .set({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      updatedAt: entry.updatedAt,
      mood: entry.mood || null,
      moodEmoji: entry.moodEmoji || null,
      isLocked: entry.isLocked,
      isVault: entry.isVault,
      templateId: entry.templateId || null,
    })
    .where(eq(entries.id, entry.id));
};

export const deleteEntry = async (id: string): Promise<void> => {
  await db.delete(entries).where(eq(entries.id, id));
};

export const getEntriesByDate = async (date: string): Promise<DiaryEntry[]> => {
  const result = await db
    .select()
    .from(entries)
    .where(eq(entries.date, date))
    .orderBy(desc(entries.createdAt));

  return result.map((entry) => ({
    id: entry.id,
    title: entry.title,
    content: entry.content,
    date: entry.date,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
    mood: entry.mood || undefined,
    moodEmoji: entry.moodEmoji || undefined,
    isLocked: entry.isLocked,
    isVault: entry.isVault,
    templateId: entry.templateId || undefined,
  }));
};

// ============================================================================
// Tag operations
// ============================================================================

export const createTag = async (tag: Tag): Promise<void> => {
  await db.insert(tags).values({
    id: tag.id,
    name: tag.name,
    color: tag.color,
    createdAt: tag.createdAt,
  });
};

export const getAllTags = async (): Promise<Tag[]> => {
  const result = await db.select().from(tags).orderBy(asc(tags.name));
  return result.map((tag) => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
    createdAt: tag.createdAt,
  }));
};

export const getTagsByEntry = async (entryId: string): Promise<Tag[]> => {
  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
      color: tags.color,
      createdAt: tags.createdAt,
    })
    .from(tags)
    .innerJoin(entryTags, eq(tags.id, entryTags.tagId))
    .where(eq(entryTags.entryId, entryId));

  return result;
};

export const addTagToEntry = async (entryId: string, tagId: string): Promise<void> => {
  await db.insert(entryTags).values({ entryId, tagId }).onConflictDoNothing();
};

export const removeTagFromEntry = async (entryId: string, tagId: string): Promise<void> => {
  await db
    .delete(entryTags)
    .where(and(eq(entryTags.entryId, entryId), eq(entryTags.tagId, tagId)));
};

export const deleteTag = async (id: string): Promise<void> => {
  await db.delete(tags).where(eq(tags.id, id));
};

// ============================================================================
// Media operations
// ============================================================================

export const createMediaAttachment = async (media: MediaAttachment): Promise<void> => {
  await db.insert(mediaAttachments).values({
    id: media.id,
    entryId: media.entryId,
    type: media.type,
    uri: media.uri,
    thumbnailUri: media.thumbnailUri || null,
    fileName: media.fileName,
    fileSize: media.fileSize,
    mimeType: media.mimeType,
    createdAt: media.createdAt,
  });
};

export const getMediaByEntry = async (entryId: string): Promise<MediaAttachment[]> => {
  const result = await db
    .select()
    .from(mediaAttachments)
    .where(eq(mediaAttachments.entryId, entryId))
    .orderBy(asc(mediaAttachments.createdAt));

  return result.map((media) => ({
    id: media.id,
    entryId: media.entryId,
    type: media.type as 'image' | 'video' | 'audio' | 'file',
    uri: media.uri,
    thumbnailUri: media.thumbnailUri || undefined,
    fileName: media.fileName,
    fileSize: media.fileSize,
    mimeType: media.mimeType,
    createdAt: media.createdAt,
  }));
};

export const deleteMediaAttachment = async (id: string): Promise<void> => {
  await db.delete(mediaAttachments).where(eq(mediaAttachments.id, id));
};

// ============================================================================
// Template operations
// ============================================================================

export const createTemplate = async (template: Template): Promise<void> => {
  await db.insert(templates).values({
    id: template.id,
    name: template.name,
    description: template.description || null,
    content: template.content,
    category: template.category,
    createdAt: template.createdAt,
  });
};

export const getAllTemplates = async (): Promise<Template[]> => {
  const result = await db.select().from(templates).orderBy(asc(templates.name));
  return result.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description || '',
    content: template.content,
    category: template.category as Template['category'],
    createdAt: template.createdAt,
  }));
};

export const getTemplate = async (id: string): Promise<Template | null> => {
  const result = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
  if (result.length === 0) return null;

  const template = result[0];
  return {
    id: template.id,
    name: template.name,
    description: template.description || '',
    content: template.content,
    category: template.category as Template['category'],
    createdAt: template.createdAt,
  };
};

// ============================================================================
// Reminder operations
// ============================================================================

export const saveReminder = async (reminder: Reminder): Promise<void> => {
  await db
    .insert(reminders)
    .values({
      id: reminder.id,
      enabled: reminder.enabled,
      time: reminder.time,
      days: JSON.stringify(reminder.days),
    })
    .onConflictDoUpdate({
      target: reminders.id,
      set: {
        enabled: reminder.enabled,
        time: reminder.time,
        days: JSON.stringify(reminder.days),
      },
    });
};

export const getReminder = async (): Promise<Reminder | null> => {
  const result = await db.select().from(reminders).limit(1);
  if (result.length === 0) return null;

  const reminder = result[0];
  return {
    id: reminder.id,
    enabled: reminder.enabled,
    time: reminder.time,
    days: JSON.parse(reminder.days),
  };
};

// ============================================================================
// Settings operations
// ============================================================================

export const saveSetting = async (key: string, value: string): Promise<void> => {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value },
    });
};

export const getSetting = async (key: string): Promise<string | null> => {
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result[0]?.value || null;
};

export const getAllSettings = async (): Promise<Record<string, string>> => {
  const result = await db.select().from(settings);
  const settingsObj: Record<string, string> = {};
  result.forEach((row) => {
    settingsObj[row.key] = row.value;
  });
  return settingsObj;
};

// ============================================================================
// Coins operations
// ============================================================================

export const getCoins = async (): Promise<number> => {
  try {
    // Check cache first
    if (coinCache && Date.now() - coinCache.timestamp < CACHE_DURATION) {
      return coinCache.amount;
    }

    // Get the breakdown and calculate total
    const breakdown = await getCoinBreakdown();
    const amount = breakdown.total;

    // Update cache
    coinCache = {
      amount,
      timestamp: Date.now(),
      welcomeBonus: false,
    };

    return amount;
  } catch (error) {
    console.error('Error getting coins:', error);
    throw error;
  }
};

export const getCoinBreakdown = async () => {
  const result = await db.select().from(coins).limit(1);
  const coinData = result[0] || {
    amount: 0,
    achievementCoins: 0,
    gameCoins: 0,
    welcomeBonusGiven: 0,
  };

  return {
    total: coinData.amount,
    achievement: coinData.achievementCoins,
    game: coinData.gameCoins,
    welcomeBonus: coinData.welcomeBonusGiven,
  };
};

export const getWelcomeBonusStatus = async (): Promise<boolean> => {
  if (coinCache && Date.now() - coinCache.timestamp < CACHE_DURATION) {
    return coinCache.welcomeBonus;
  }

  const result = await db.select().from(coins).limit(1);
  const welcomeBonus = result[0]?.welcomeBonusGiven === 1;

  if (coinCache) {
    coinCache.welcomeBonus = welcomeBonus;
  }

  return welcomeBonus;
};

// ============================================================================
// Stats operations
// ============================================================================

export const getStats = async () => {
  try {
    // Check cache first
    if (statsCache && Date.now() - statsCache.timestamp < CACHE_DURATION) {
      return {
        gamesPlayed: statsCache.gamesPlayed,
        gamesWon: statsCache.gamesWon,
        highestScore: statsCache.highestScore,
        totalScore: statsCache.totalScore,
      };
    }

    const result = await db.select().from(stats).limit(1);
    const statsData = result[0] || {
      gamesPlayed: 0,
      gamesWon: 0,
      highestScore: 0,
      totalScore: 0,
    };

    // Update cache
    statsCache = {
      gamesPlayed: statsData.gamesPlayed ?? 0,
      gamesWon: statsData.gamesWon ?? 0,
      highestScore: statsData.highestScore ?? 0,
      totalScore: statsData.totalScore ?? 0,
      timestamp: Date.now(),
    };

    return {
      gamesPlayed: statsData.gamesPlayed ?? 0,
      gamesWon: statsData.gamesWon ?? 0,
      highestScore: statsData.highestScore ?? 0,
      totalScore: statsData.totalScore ?? 0,
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

export const updateStats = async (updates: {
  gamesPlayed?: number;
  gamesWon?: number;
  highestScore?: number;
  totalScore?: number;
}) => {
  const result = await db.select().from(stats).limit(1);
  const current = result[0];

  if (current) {
    await db
      .update(stats)
      .set({
        gamesPlayed: updates.gamesPlayed ?? (current.gamesPlayed ?? 0),
        gamesWon: updates.gamesWon ?? (current.gamesWon ?? 0),
        highestScore: updates.highestScore ?? (current.highestScore ?? 0),
        totalScore: updates.totalScore ?? (current.totalScore ?? 0),
      })
      .where(eq(stats.id, current.id));
  } else {
    await db.insert(stats).values({
      gamesPlayed: updates.gamesPlayed ?? 0,
      gamesWon: updates.gamesWon ?? 0,
      highestScore: updates.highestScore ?? 0,
      totalScore: updates.totalScore ?? 0,
    });
  }

  // Invalidate cache
  statsCache = null;
};

// ============================================================================
// Database class wrapper (for backward compatibility)
// ============================================================================

class Database {
  async init(): Promise<void> {
    // Drizzle migrations are handled in app/_layout.tsx
    // No manual initialization needed
  }

  // Entry operations
  async createEntry(entry: DiaryEntry): Promise<void> {
    return createEntry(entry);
  }

  async getEntry(id: string): Promise<DiaryEntry | null> {
    return getEntry(id);
  }

  async getAllEntries(): Promise<DiaryEntry[]> {
    return getAllEntries();
  }

  async getEntriesByDateRange(startDate: string, endDate: string): Promise<DiaryEntry[]> {
    return getEntriesByDateRange(startDate, endDate);
  }

  async searchEntries(query: string): Promise<DiaryEntry[]> {
    return searchEntries(query);
  }

  async updateEntry(entry: DiaryEntry): Promise<void> {
    return updateEntry(entry);
  }

  async deleteEntry(id: string): Promise<void> {
    return deleteEntry(id);
  }

  async getEntriesByDate(date: string): Promise<DiaryEntry[]> {
    return getEntriesByDate(date);
  }

  // Tag operations
  async createTag(tag: Tag): Promise<void> {
    return createTag(tag);
  }

  async getAllTags(): Promise<Tag[]> {
    return getAllTags();
  }

  async getTagsByEntry(entryId: string): Promise<Tag[]> {
    return getTagsByEntry(entryId);
  }

  async addTagToEntry(entryId: string, tagId: string): Promise<void> {
    return addTagToEntry(entryId, tagId);
  }

  async removeTagFromEntry(entryId: string, tagId: string): Promise<void> {
    return removeTagFromEntry(entryId, tagId);
  }

  async deleteTag(id: string): Promise<void> {
    return deleteTag(id);
  }

  // Media operations
  async createMediaAttachment(media: MediaAttachment): Promise<void> {
    return createMediaAttachment(media);
  }

  async getMediaByEntry(entryId: string): Promise<MediaAttachment[]> {
    return getMediaByEntry(entryId);
  }

  async deleteMediaAttachment(id: string): Promise<void> {
    return deleteMediaAttachment(id);
  }

  // Template operations
  async createTemplate(template: Template): Promise<void> {
    return createTemplate(template);
  }

  async getAllTemplates(): Promise<Template[]> {
    return getAllTemplates();
  }

  async getTemplate(id: string): Promise<Template | null> {
    return getTemplate(id);
  }

  // Reminder operations
  async saveReminder(reminder: Reminder): Promise<void> {
    return saveReminder(reminder);
  }

  async getReminder(): Promise<Reminder | null> {
    return getReminder();
  }

  // Settings operations
  async saveSetting(key: string, value: string): Promise<void> {
    return saveSetting(key, value);
  }

  async getSetting(key: string): Promise<string | null> {
    return getSetting(key);
  }

  async getAllSettings(): Promise<Record<string, string>> {
    return getAllSettings();
  }
}

export const database = new Database();

