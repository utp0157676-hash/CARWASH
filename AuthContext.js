import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from './firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar el estado de autenticación en tiempo real
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Obtener datos adicionales del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          ...(userDoc.exists() ? userDoc.data() : {}),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Función para registrar usuarios en Firebase y guardar en Firestore
  const register = async (email, password, name, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    // Guardar los datos del usuario en la colección 'users'
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      name: name,
      email: email,
      phone: phone || '',
      createdAt: new Date().toISOString(),
    });

    return newUser;
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  // Función para cerrar sesión
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      loading, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};