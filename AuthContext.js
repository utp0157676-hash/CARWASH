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
      try {
        if (currentUser) {
          // Obtener datos adicionales del usuario desde Firestore
          let extraData = {};
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              extraData = userDoc.data();
            }
          } catch (docErr) {
            console.warn('Advertencia al consultar datos de usuario en Firestore:', docErr.message);
          }

          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            name: extraData.name || extraData.username || currentUser.email?.split('@')[0] || 'Usuario',
            ...extraData,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error en onAuthStateChanged:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para registrar usuarios en Firebase y guardar en Firestore
  const register = async (email, password, name, phone) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    const userData = {
      uid: newUser.uid,
      name: name || '',
      username: name || '',
      email: email,
      phone: phone || '',
      role: 'client',
      createdAt: new Date().toISOString(),
    };

    // Guardar los datos del usuario en la colección 'users'
    try {
      await setDoc(doc(db, 'users', newUser.uid), userData);
    } catch (dbErr) {
      console.warn('Error al guardar datos de usuario en Firestore:', dbErr);
    }

    setUser({
      uid: newUser.uid,
      email: newUser.email,
      ...userData,
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
    setUser(null);
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