import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function AppointmentScreen({ navigation }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleNext = () => {
    // Validaciones e integración futura de DB
    navigation.navigate('Pago', { date, time });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Paso 4: Agenda tu Horario</Text>
      
      <Text style={styles.label}>Fecha (DD/MM/AAAA)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej: 25/10/2026" 
        value={date} 
        onChangeText={setDate} 
      />

      <Text style={styles.label}>Hora</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej: 10:30 AM" 
        value={time} 
        onChangeText={setTime} 
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continuar al Pago</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#444' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});