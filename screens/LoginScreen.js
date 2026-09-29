import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { showAlert } from '../utils/platformAlert';

export default function LoginScreen({ navigation }) {
  const { login, register } = useContext(AuthContext);

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (isRegistering) {
      if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
        showAlert('Campos incompletos', 'Por favor llena todos los campos obligatorios.');
        return;
      }
      if (password !== confirmPassword) {
        showAlert('Error de validacion', 'Las contrasenas no coinciden.');
        return;
      }
      if (password.length < 6) {
        showAlert('Contrasena debil', 'La contrasena debe tener al menos 6 caracteres.');
        return;
      }
    } else {
      if (!username.trim() || !password.trim()) {
        showAlert('Campos incompletos', 'Ingresa tu usuario/correo y contrasena.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isRegistering) {
        await register(email.trim(), password, username.trim(), phone.trim());
        showAlert('Registro Exitoso', 'Tu cuenta ha sido creada exitosamente.');
      } else {
        const loginEmail = username.includes('@') ? username.trim() : `${username.trim()}@carwash.com`;
        await login(loginEmail, password);
      }
      navigation.navigate('Inicio');
    } catch (error) {
      console.error('Error en autenticacion:', error);
      let userMsg = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        userMsg = 'Credenciales invalidas. Verifica tu usuario/correo y contrasena.';
      } else if (error.code === 'auth/email-already-in-use') {
        userMsg = 'Este correo ya esta registrado. Inicia sesion o utiliza otro.';
      }
      showAlert('Error de Autenticacion', userMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} 
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.iconHeader}>
          <Ionicons 
            name={isRegistering ? "person-add-outline" : "lock-closed-outline"} 
            size={42} 
            color="#007AFF" 
          />
        </View>

        <Text style={styles.title}>
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Text>
        <Text style={styles.subtitle}>
          {isRegistering ? 'Registrate para gestionar tus citas y vehiculos' : 'Accede a tu cuenta de Perfect Shine'}
        </Text>

        {isRegistering && (
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={isRegistering ? "Nombre de usuario" : "Usuario o correo"}
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
        </View>

        {isRegistering && (
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Telefono de contacto (opcional)"
              placeholderTextColor="#94a3b8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <Ionicons name="key-outline" size={20} color="#64748b" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {isRegistering && (
          <View style={styles.inputWrapper}>
            <Ionicons name="checkmark-done-outline" size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              placeholderTextColor="#94a3b8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 15 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleAuth} activeOpacity={0.8}>
            <Text style={styles.buttonText}>
              {isRegistering ? 'REGISTRARSE' : 'INICIAR SESIÓN'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.switchButton}
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <Text style={styles.switchText}>
            {isRegistering
              ? '¿Ya tienes una cuenta? Inicia Sesión'
              : '¿No tienes una cuenta? Regístrate aquí'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  iconHeader: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 14,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0f172a',
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});