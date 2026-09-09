import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyCarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mi Vehículo Registrado</Text>
      <View style={styles.box}>
        <Text style={styles.info}>Modelo: Sedan Deportivo</Text>
        <Text style={styles.info}>Placa: ABC-1234</Text>
        <Text style={styles.info}>Color: Gris Platino</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  box: { padding: 15, backgroundColor: '#f0f4f8', borderRadius: 8 },
  info: { fontSize: 16, marginVertical: 4, color: '#333' },
});