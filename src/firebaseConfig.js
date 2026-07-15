import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyBrPsVofR9n9DYuVsJG8YuPYIzgXgTV13g',
  authDomain: 'jeevsahay.firebaseapp.com',
  projectId: 'jeevsahay',
  storageBucket: 'jeevsahay.firebasestorage.app',
  messagingSenderId: '1069796707140',
  appId: '1:1069796707140:web:39ccafe15d22ef2eb2a511',
  measurementId: 'G-WCLC3YJ10B',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export default app;