import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tu configuración real de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAqO0j83iUJe-kD0QpkBJba2C2Qb6XSK0g",
  authDomain: "perfectshine-fe817.firebaseapp.com",
  projectId: "perfectshine-fe817",
  storageBucket: "perfectshine-fe817.firebasestorage.app",
  messagingSenderId: "212848395229",
  appId: "1:212848395229:web:83e8ae7d62fd0743a92c34"
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Autenticación con almacenamiento local seguro para Expo
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Inicializar Firestore (Base de Datos)
const db = getFirestore(app);

export { auth, db };