/**
 * Firebase Configuration for HomeoInvent Family Sharing
 * 
 * SETUP INSTRUCTIONS:
 * 1. Replace the placeholder values below with your actual Firebase project credentials
 * 2. Enable Firestore Database in your Firebase Console
 * 3. Set up Firestore security rules (see README.md for recommended rules)
 * 4. Enable Authentication if needed (optional for this implementation)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// REPLACE THESE PLACEHOLDERS WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "your-api-key-here",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// For local development, you can uncomment the following lines to use the Firestore emulator
// if (process.env.NODE_ENV === 'development' && !process.env.VITE_FIREBASE_USE_EMULATOR_DISABLED) {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     console.log('Connected to Firestore emulator');
//   } catch (error) {
//     console.log('Firestore emulator already connected or not available');
//   }
// }

// Check if Firebase is properly configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "your-api-key-here" && 
         firebaseConfig.projectId !== "your-project-id";
};

export default app;