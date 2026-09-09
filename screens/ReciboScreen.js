import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ReciboScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>¡Cita Confirmada!</Text>
      <Text style={styles.subtitle}>Tu reservación ha sido registrada con éxito.</Text>

      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Inicio')}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  icon: { fontSize: 60, marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30 },
  button: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});