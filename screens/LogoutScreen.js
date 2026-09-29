import React, { useContext, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';

export default function LogoutScreen({ navigation }) {
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (e) {
        console.warn('Error al cerrar sesión:', e);
      } finally {
        navigation.navigate('Inicio');
      }
    };
    doLogout();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Cerrando sesión de forma segura...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  text: { 
    marginTop: 14, 
    fontSize: 15, 
    color: '#64748b',
    fontWeight: '500',
  },
});