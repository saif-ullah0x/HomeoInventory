import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useEffect, useState } from "react";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase with error handling
let app: any;
let auth: any;
const googleProvider = new GoogleAuthProvider();

try {
  // Log config (without exposing sensitive data)
  console.log("Firebase initialization with project ID:", firebaseConfig.projectId);
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create fallback values for development
  if (!app) app = {} as any;
  if (!auth) auth = {} as any;
}

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Hook to use authentication state
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      if (auth && typeof auth.onAuthStateChanged === 'function') {
        unsubscribe = onAuthStateChanged(
          auth, 
          (user) => {
            setUser(user);
            setLoading(false);
            setError(null);
          },
          (error) => {
            console.error("Auth state change error:", error);
            setError(error as Error);
            setLoading(false);
          }
        );
      } else {
        console.log("Auth not fully initialized, authentication disabled");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(err as Error);
      setLoading(false);
    }

    return () => {
      try {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      } catch (err) {
        console.error("Error unsubscribing:", err);
      }
    };
  }, []);

  return { user, loading, error, isEnabled: Boolean(auth && typeof auth.onAuthStateChanged === 'function') };
}