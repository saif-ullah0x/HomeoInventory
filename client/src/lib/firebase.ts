import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signOut, User } from "firebase/auth";
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

// Check for redirect result on page load
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error checking redirect result: ", error);
    throw error;
  }
};

// Sign in with Google using redirect (better for Replit environment)
export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
    // The page will redirect to Google and then back to the app
    // No need to return anything here as the redirect will happen
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