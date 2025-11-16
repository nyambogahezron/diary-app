import * as Notifications from 'expo-notifications';
import { database } from '../services';
import type { Reminder } from '../types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleReminder(reminder: Reminder): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!reminder.enabled) {
      return null;
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);

    // Schedule for each selected day
    const notificationIds: string[] = [];
    for (const day of reminder.days) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '📔 Time to Write',
          body: 'Don\'t forget to write in your diary today!',
          sound: true,
        },
        trigger: {
          weekday: day + 1, // 1-7, Sunday = 1
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      });
      notificationIds.push(notificationId);
    }

    await database.saveReminder(reminder);
    return notificationIds[0];
  } catch (error) {
    console.error('Error scheduling reminder:', error);
    return null;
  }
}

export async function cancelReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function getStreak(): Promise<number> {
  try {
    const entries = await database.getAllEntries();
    if (entries.length === 0) return 0;

    // Sort by date descending
    const sortedEntries = entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

