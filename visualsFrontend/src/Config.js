import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithEmailLink,
  isSignInWithEmailLink
} from 'firebase/auth';

// Firebase Configuration - Uses environment variables, falls back to defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDykX7dsfBtBLLJQZCoseKFiKUzKu4ezuo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sumukhvisuals.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sumukhvisuals',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sumukhvisuals.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '139618548157',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:139618548157:web:7c59a12dd6c53dcaa6fad4',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-57QZQ6884V',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔴 Google Provider with Account Selection
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'  // Force account selection popup
});

// 🔴 Microsoft Provider with Account Selection
const microsoftProvider = new OAuthProvider('microsoft.com');
microsoftProvider.addScope('profile');  // 🔴 FIXED: addScope (singular)
microsoftProvider.addScope('email');    // 🔴 FIXED: addScope (singular)
microsoftProvider.setCustomParameters({
  prompt: 'select_account'  // Force account selection popup
});

// 🔴 Apple Provider with Account Selection
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');  // 🔴 FIXED: addScope (singular)
appleProvider.addScope('name');   // 🔴 FIXED: addScope (singular)
appleProvider.setCustomParameters({
  prompt: 'select_account'  // Force account selection popup
});

// 🔴 Generic Social Login (returns token)
export const socialLogin = async (provider) => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    return idToken;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
    } else {
    }
    throw error;
  }
};

// 🔴 Google Login Handler
export const handleGoogleLogin = async (setError) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    if (setError) setError('');
    
    // Return user info along with token
    return {
      token: idToken,
      uid: user.uid,
      email: user.email,
      name: user.displayName || user.email.split('@')[0],
      avatar: user.photoURL,
    };
  } catch (err) {
    const errorMessage = err.code === 'auth/popup-closed-by-user' 
      ? 'Login cancelled' 
      : 'Google Sign-In failed. ' + err.message;
    if (setError) setError(errorMessage);
    throw err;
  }
};

// 🔴 Microsoft Login Handler
export const handleMicrosoftLogin = async (setError) => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    if (setError) setError('');
    return idToken;
  } catch (err) {
    const errorMessage = err.code === 'auth/popup-closed-by-user' 
      ? 'Login cancelled' 
      : 'Microsoft Sign-In failed. ' + err.message;
    if (setError) setError(errorMessage);
    throw err;
  }
};

// 🔴 Apple Login Handler
export const handleAppleLogin = async (setError) => {
  try {
    const result = await signInWithPopup(auth, appleProvider);
    const user = result.user;
    const idToken = await user.getIdToken();
    if (setError) setError('');
    return idToken;
  } catch (err) {
    const errorMessage = err.code === 'auth/popup-closed-by-user' 
      ? 'Login cancelled' 
      : 'Apple Sign-In failed. ' + err.message;
    if (setError) setError(errorMessage);
    throw err;
  }
};

// Exports
export {
  auth,
  googleProvider,
  microsoftProvider,
  appleProvider,
  isSignInWithEmailLink,
  signInWithEmailLink
};