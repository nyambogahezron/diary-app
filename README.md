# Diary App 📔

A comprehensive, feature-rich diary/journal application built with React Native and Expo. This app provides a secure, offline-first platform for personal journaling with advanced features like mood tracking, media attachments, cloud sync, and more.

## ✨ Features

### ✅ Core Features (Must-Have)

1. **Create, Read, Edit, Delete Entries**
   - Full CRUD operations for daily notes
   - Rich text editor with markdown support
   - Title, content, and date management

2. **Calendar View**
   - Monthly calendar with highlighted days that have entries
   - Tap to open or create a day's entry
   - Visual indicators for entries

3. **Search**
   - Search by text content
   - Filter by date range
   - Advanced filtering options

4. **Secure Access**
   - PIN/Password protection (local storage)
   - Biometric unlock (Fingerprint / FaceID)
   - Secure entry locking

5. **Themes & Appearance**
   - Light/Dark mode support
   - Auto theme based on system settings
   - Font size adjustments (small, medium, large)

6. **Media Attachments**
   - Add photos to entries
   - Video attachments
   - Audio recordings
   - File attachments (PDF, documents)

### ⚡ Advanced Features

7. **Mood Tracking**
   - Mood selection (emoji-based, 1-5 scale)
   - Mood analytics charts
   - Weekly/monthly mood trends
   - Average mood calculation

8. **Tags & Categories**
   - Tag entries (Work, Personal, Ideas, Travel, etc.)
   - Filter by tag
   - Color-coded tags
   - Custom tag creation

9. **Cloud Sync** (Infrastructure Ready)
   - Sync across devices
   - Support for Firebase, Supabase, iCloud, Google Drive
   - Offline-first architecture

10. **Voice Input**
    - Speech-to-text for quick journaling
    - Voice recording support
    - Audio playback

11. **Reminders & Notifications**
    - Daily reminder to write
    - Streaks tracking
    - Motivation system
    - Customizable notification times

12. **AI Assistant** (Placeholder)
    - Summarize entries
    - Generate prompts to write about
    - Insights (e.g., "You felt stressed often this week")

13. **Export & Backup**
    - Export to Markdown
    - Export to PDF (placeholder)
    - Export to ZIP
    - Automatic cloud backup

14. **Offline-First**
    - Works fully offline
    - SQLite local database
    - Syncs later when online

15. **Mood & Activity Correlation**
    - Track habits (optional)
    - Charts showing correlations
    - Analytics dashboard

### ⭐ Premium / Unique Features

16. **Private Spaces**
    - Lock specific entries
    - Separate "vault" area
    - Enhanced security

17. **Templates**
    - Daily reflection template
    - Bullet journal template
    - Gratitude journaling template
    - Dream journal template
    - Custom templates

18. **Timeline View**
    - Scrollable timeline of all entries
    - Chronological organization
    - Visual timeline representation

19. **Multi-Media Journal**
    - Drawing canvas for sketches (placeholder)
    - Stickers/emojis
    - Voice memories
    - Rich media support

20. **Sync With Wearables** (Future)
    - Quick voice notes from smartwatch
    - Auto-tag mood from wearable data

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun
- Expo CLI
- iOS Simulator / Android Emulator or physical device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diary-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm start
# or
yarn start
# or
bun start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Project Structure

```
diary-app/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   └── entry/             # Entry detail and creation
├── components/            # Reusable components
├── db/                    # Database layer
│   └── database.ts        # SQLite database operations
├── store/                 # State management (Zustand)
│   ├── useAuthStore.ts    # Authentication state
│   ├── useEntriesStore.ts # Entries state
│   └── useSettingsStore.ts # Settings state
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── export.ts         # Export functionality
│   ├── media.ts          # Media handling
│   ├── notifications.ts  # Notifications & reminders
│   ├── templates.ts      # Journal templates
│   └── voice.ts         # Voice input
└── assets/               # Images and static assets
```

## 🗄️ Database Schema

The app uses SQLite with the following main tables:

- **entries**: Diary entries with title, content, date, mood, etc.
- **tags**: User-defined tags
- **entry_tags**: Junction table for entry-tag relationships
- **media_attachments**: Media files attached to entries
- **templates**: Journal templates
- **reminders**: Notification reminders
- **settings**: App settings

## 🔐 Security

- PIN/Password stored securely using Expo SecureStore
- Biometric authentication via Expo Local Authentication
- Entry-level locking support
- Vault for sensitive entries

## 🎨 Theming

The app supports:
- Light mode
- Dark mode
- Auto (follows system theme)
- Customizable font sizes

## 📦 Dependencies

Key dependencies:
- **expo**: Expo SDK
- **expo-router**: File-based routing
- **expo-sqlite**: Local database
- **expo-local-authentication**: Biometric auth
- **expo-secure-store**: Secure storage
- **expo-image-picker**: Image selection
- **expo-document-picker**: File selection
- **expo-notifications**: Push notifications
- **react-native-calendars**: Calendar component
- **zustand**: State management
- **date-fns**: Date utilities
- **nativewind**: Tailwind CSS for React Native

## 🛠️ Development

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting

### Running Tests

```bash
npm test
```

### Building for Production

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contributions are not accepted at this time.

## 📧 Support

For support, please contact the development team.

---

Built with ❤️ using React Native and Expo

