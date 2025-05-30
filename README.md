# HomeoInvent - Family Inventory Sharing System

A comprehensive homeopathic medicine inventory management app with real-time family sharing capabilities.

## Features

### 🏠 Family Inventory Sharing
- **Create Family**: Generate a unique family ID and start a shared inventory
- **Join Family**: Use a family ID to access an existing shared inventory  
- **Real-time Sync**: All changes appear instantly for all family members
- **Dual Backend Support**: Works with both PostgreSQL (NeonDB) and Firebase Firestore

### 🔄 Synchronization Methods
1. **Database Sync**: Uses your NeonDB PostgreSQL database with WebSocket real-time updates
2. **Firebase Sync**: Optional Firebase Firestore integration for enhanced real-time collaboration
3. **Hybrid Mode**: Can use both systems simultaneously for maximum reliability

## Setup Instructions

### 1. Database Setup (NeonDB PostgreSQL)

The app is already configured to work with your NeonDB database. The following tables are automatically created:

- `medicines` - Stores all family medicines with `family_id` linking
- `families` - Tracks family information and metadata
- `family_members` - Manages family membership and member details

### 2. Firebase Setup (Optional - For Enhanced Real-time Sync)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Go to Project Settings → General → Your apps
5. Add a web app and copy the configuration

#### Step 2: Configure Firebase Credentials
Create a `.env.local` file in your project root and add your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdefghijklmnop
```

#### Step 3: Set Up Firestore Security Rules
In your Firebase Console, go to Firestore Database → Rules and set up:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Family documents - readable by anyone with family ID
    match /families/{familyId} {
      allow read, write: if true; // Adjust security as needed
    }
    
    // Family members - readable by family members
    match /family_members/{memberId} {
      allow read, write: if true; // Adjust security as needed
    }
    
    // Medicines - readable/writable by family members
    match /medicines/{medicineId} {
      allow read, write: if true; // Adjust security as needed
    }
  }
}
```

#### Step 4: Enable Firebase in the App
Once configured, Firebase will automatically be detected and enabled. You can also manually enable it:

```javascript
// In your app, Firebase sync can be enabled/disabled
useStore.getState().enableFirebaseSync(); // Enable real-time sync
useStore.getState().disableFirebaseSync(); // Disable real-time sync
```

### 3. Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will be available at http://localhost:5000
```

## How Family Sharing Works

### Creating a Family

1. Click the **Family Sharing** button (bottom left, users icon)
2. Select **"Create Family"** tab
3. Enter your name
4. Click **"Create Family"**
5. A unique 8-character Family ID is generated (e.g., `ABC12345`)
6. Share this ID with family members

### Joining a Family

1. Get the Family ID from a family member
2. Click the **Family Sharing** button
3. Select **"Join Family"** tab  
4. Enter your name and the Family ID
5. Click **"Join Family"**
6. You now share the same inventory

### Real-time Synchronization

#### Database + WebSocket Sync (Default)
- Uses your NeonDB PostgreSQL database
- WebSocket connections provide real-time updates
- All CRUD operations sync instantly across family members

#### Firebase Firestore Sync (Enhanced)
- Uses Firebase's `onSnapshot()` listeners for real-time updates
- Provides Google Docs-like collaboration experience
- Automatically handles offline/online synchronization
- Works alongside your existing database

#### How It Works Together
1. **Add Medicine**: Saved to both database and Firebase (if enabled)
2. **Edit Medicine**: Updates propagate through both systems  
3. **Delete Medicine**: Removed from both systems
4. **Real-time Updates**: Firebase listeners update all family members instantly

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React +      │◄──►│   (Express +    │◄──►│   (NeonDB       │
│    Zustand)     │    │    WebSocket)   │    │    PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                              │
         │              ┌─────────────────┐             │
         └─────────────►│   Firebase      │◄────────────┘
                        │   Firestore     │
                        │   (Real-time)   │
                        └─────────────────┘
```

## Code Structure

### Key Files Added/Modified

#### Backend Files
- `server/family-inventory-service.ts` - Handles family operations and WebSocket sync
- `server/routes.ts` - Family API endpoints (`/api/family/*`)
- `shared/schema.ts` - Database schema with family support

#### Frontend Files  
- `client/src/lib/firebase-config.ts` - Firebase configuration
- `client/src/lib/firebase-family-service.ts` - Firebase Firestore operations
- `client/src/lib/store.ts` - Enhanced with family and Firebase sync
- `client/src/components/family-setup.tsx` - Family creation/joining UI
- `client/src/components/family-share-modal.tsx` - Entry point for family features

### Database Schema

```sql
-- Medicines table (enhanced with family support)
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  potency TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  sub_location TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  bottle_size TEXT,
  family_id TEXT NOT NULL,  -- Links to family
  added_by TEXT,           -- Who added this medicine
  last_updated TIMESTAMP DEFAULT NOW()
);

-- Families table
CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  family_id TEXT UNIQUE NOT NULL,  -- 8-character unique ID
  created_by TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Family members table
CREATE TABLE family_members (
  id SERIAL PRIMARY KEY,
  family_id TEXT NOT NULL,
  member_name TEXT NOT NULL,
  member_id TEXT NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(family_id, member_id)
);
```

## Testing the Family Sharing

### Local Testing
1. Open the app in two different browser windows/tabs
2. In first window: Create a family and note the Family ID
3. In second window: Join the family using the ID
4. Add/edit/delete medicines in either window
5. Changes should appear in both windows instantly

### Multi-Device Testing
1. Deploy your app or use local network access
2. Use different devices (phone, tablet, computer)
3. Each device joins the same family
4. Test real-time synchronization across all devices

## Troubleshooting

### Firebase Not Working
- Check that all Firebase environment variables are set correctly
- Verify Firestore is enabled in Firebase Console
- Check browser console for Firebase connection errors
- Ensure Firestore security rules allow read/write access

### WebSocket Connection Issues
- Check that the backend server is running
- Verify WebSocket connections in browser developer tools
- Look for connection errors in server logs

### Database Sync Problems
- Verify NeonDB connection is working
- Check database tables exist with correct schema
- Look for API errors in browser network tab

## DeepSeek AI Integration

The app includes AI-powered features using DeepSeek R1 API:
- **AI Doctor**: Symptom analysis and remedy suggestions
- **AI Helper**: Inventory management insights
- **Learning Assistant**: Educational content and quizzes

To enable AI features, add your DeepSeek API key:
```env
DEEPSEEK_API_KEY=your-deepseek-api-key-here
```

## Security Considerations

### Family ID Security
- Family IDs are 8-character random strings
- Only those with the ID can access the family inventory
- Consider implementing expiring invite links for added security

### Firebase Security
- Review and customize Firestore security rules for your use case
- Consider implementing user authentication for enhanced security
- Monitor usage through Firebase Console

### Database Security
- Ensure your NeonDB connection uses SSL
- Keep database credentials secure
- Implement proper access controls as needed

## Contributing

When adding new features:
1. Add comprehensive comments explaining the functionality
2. Update this README with any new setup steps
3. Test both database and Firebase sync thoroughly
4. Ensure backward compatibility with existing data

## Support

For issues with:
- **Database connectivity**: Check your NeonDB connection string
- **Firebase setup**: Verify your Firebase configuration
- **Real-time sync**: Check both WebSocket and Firebase connections
- **API features**: Ensure DeepSeek API key is configured

---

**HomeoInvent** - Modern family medicine management with real-time collaboration.