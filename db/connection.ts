import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const DB_NAME = 'diary.db';

const expo = SQLite.openDatabaseSync(DB_NAME);

export const db = drizzle(expo);