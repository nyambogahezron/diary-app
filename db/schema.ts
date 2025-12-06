import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Entries table
export const entries = sqliteTable('entries', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  date: text('date').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  mood: integer('mood'),
  moodEmoji: text('mood_emoji'),
  templateId: text('template_id'),
});

// Tags table
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').notNull(),
  createdAt: text('created_at').notNull(),
});

// Entry tags junction table
export const entryTags = sqliteTable('entry_tags', {
  entryId: text('entry_id')
    .notNull()
    .references(() => entries.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
});

// Media attachments table
export const mediaAttachments = sqliteTable('media_attachments', {
  id: text('id').primaryKey(),
  entryId: text('entry_id')
    .notNull()
    .references(() => entries.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'image' | 'video' | 'audio' | 'file'
  uri: text('uri').notNull(),
  thumbnailUri: text('thumbnail_uri'),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  createdAt: text('created_at').notNull(),
});

// Templates table
export const templates = sqliteTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  category: text('category').notNull(), // 'daily' | 'gratitude' | 'dream' | 'bullet' | 'custom'
  createdAt: text('created_at').notNull(),
});

// Reminders table
export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  time: text('time').notNull(), // HH:mm format
  days: text('days').notNull(), // JSON array of numbers [0-6]
  lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`),
});

// Settings table
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`),
});

// Stats table (for future analytics)
export const stats = sqliteTable('stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  gamesPlayed: integer('games_played').default(0),
  gamesWon: integer('games_won').default(0),
  highestScore: integer('highest_score').default(0),
  totalScore: integer('total_score').default(0),
  lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`),
});

// Coins table (for future gamification)
export const coins = sqliteTable('coins', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  amount: integer('amount').notNull().default(0),
  achievementCoins: integer('achievement_coins').notNull().default(0),
  gameCoins: integer('game_coins').notNull().default(0),
  welcomeBonusGiven: integer('welcome_bonus_given').notNull().default(0),
  lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`),
});

