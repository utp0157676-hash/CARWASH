import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqO0j83iUJe-kD0QpkBJba2C2Qb6XSK0g",
  authDomain: "perfectshine-fe817.firebaseapp.com",
  projectId: "perfectshine-fe817",
  storageBucket: "perfectshine-fe817.firebasestorage.app",
  messagingSenderId: "212848395229",
  appId: "1:212848395229:web:83e8ae7d62fd0743a92c34"
};

// Inicializar Firebase de forma segura para Fast Refresh y Web
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Inicializar Authentication según la plataforma con salvaguarda de reinicialización
let auth;
try {
  auth = initializeAuth(app, {
    persistence:
      Platform.OS === 'web'
        ? browserLocalPersistence
        : getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

// Inicializar Firestore
const db = getFirestore(app);

export { app, auth, db };