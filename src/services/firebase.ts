import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  // @ts-expect-error getReactNativePersistence is available in react-native entry of firebase/auth
  getReactNativePersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: 'AIzaSyA8YGa2bPP2E0vMyno_nCuZ518nlBKPav0',
  authDomain: 'mibamigrash-radar.firebaseapp.com',
  projectId: 'mibamigrash-radar',
  storageBucket: 'mibamigrash-radar.firebasestorage.app',
  messagingSenderId: '620093309686',
  appId: '1:620093309686:web:f520a1f093476cb6e522d7',
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth;
if (getApps().length > 1) {
  authInstance = getAuth(app);
} else {
  try {
    if (Platform.OS === 'web') {
      authInstance = initializeAuth(app, {
        persistence: browserLocalPersistence,
      });
    } else {
      authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } catch {
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db = getFirestore(app);
