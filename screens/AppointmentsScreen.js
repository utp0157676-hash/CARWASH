import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const APPOINTMENTS_DATA = [
  { id: '101', service: 'Lavado Completo', date: '28/10/2026', time: '11:00 AM', status: 'Confirmada' },
];

export default function AppointmentsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mis Citas Programadas</Text>
      
      <FlatList
        data={APPOINTMENTS_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.details}>{item.date} a las {item.time}</Text>
            <Text style={styles.status}>Estado: {item.status}</Text>
          </View>
        )}
      />

      {/* Botón para agendar una nueva cita */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('Servicios')}
      >
        <Text style={styles.addButtonText}>+ Agendar Nueva Cita</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
  service: { fontSize: 16, fontWeight: 'bold', color: '#1a1a1a' },
  details: { fontSize: 14, color: '#555', marginTop: 4 },
  status: { fontSize: 13, color: '#28a745', marginTop: 6, fontWeight: '600' },
  addButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});