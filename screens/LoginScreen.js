import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (isRegistering) {
      if (!email || !username || !password || !confirmPassword) {
        Alert.alert('Campos incompletos', 'Por favor llena todos los campos.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden.');
        return;
      }
    } else {
      if (!username || !password) {
        Alert.alert('Campos incompletos', 'Ingresa tu usuario/correo y contraseña.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegistering) {
        // Registro en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar datos adicionales en Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          username: username,
          email: email,
          role: 'client',
          createdAt: new Date(),
        });

        Alert.alert('Éxito', 'Cuenta creada correctamente.');
      } else {
        // En Firebase Auth se ingresa con correo; si el usuario ingresó un texto, usaremos email para la autenticación
        const loginEmail = username.includes('@') ? username : `${username}@carwash.com`;
        await signInWithEmailAndPassword(auth, loginEmail, password);
      }
      navigation.navigate('Inicio');
    } catch (error) {
      Alert.alert('Error de autenticación', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminMode = () => {
    Alert.alert('Modo Admin', 'Accediendo al panel de administración...');
    // Aquí puedes redirigir a una pantalla de Admin si la tienes configurada:
    // navigation.navigate('AdminScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>
          {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
        </Text>

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isRegistering && (
          <TextInput
            style={styles.input}
            placeholder="Confirmar Contraseña"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#0088ff" style={{ marginVertical: 15 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAuth}>
            <Text style={styles.buttonText}>
              {isRegistering ? 'REGISTRARSE' : 'INICIAR SESIÓN'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.switchText}>
            {isRegistering
              ? '¿Ya tienes una cuenta? Inicia Sesión'
              : '¿No tienes una cuenta? Regístrate'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleAdminMode}>
          <Text style={styles.adminText}>Modo Admin</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 25,
    // Sombras para replicar el diseño de la imagen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#1a8cff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  switchText: {
    color: '#0033cc',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  adminText: {
    color: '#0033cc',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});