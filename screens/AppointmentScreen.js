import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { showAlert } from '../utils/platformAlert';

export default function AppointmentScreen({ route, navigation }) {
  const params = route.params || {};
  const [date, setDate] = useState('2026-09-10');
  const [time, setTime] = useState('10:00 AM');

  const handleNext = () => {
    if (!date.trim() || !time.trim()) {
      showAlert('Campos requeridos', 'Por favor ingresa la fecha y la hora deseadas.');
      return;
    }

    navigation.navigate('Pago', {
      ...params,
      date,
      time,
      appointmentDate: date,
      appointmentTime: time,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentWrapper}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Ionicons name="calendar-outline" size={40} color="#007AFF" />
        </View>

        <Text style={styles.header}>Agenda tu Horario</Text>
        <Text style={styles.subHeader}>Ingresa la fecha y horario para programar la atención</Text>
        
        <Text style={styles.label}>Fecha (AAAA-MM-DD o DD/MM/AAAA)</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="calendar-clear-outline" size={18} color="#64748b" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 2026-09-10" 
            placeholderTextColor="#94a3b8"
            value={date} 
            onChangeText={setDate} 
          />
        </View>

        <Text style={styles.label}>Hora de Atención</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="time-outline" size={18} color="#64748b" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            placeholder="Ej: 10:00 AM" 
            placeholderTextColor="#94a3b8"
            value={time} 
            onChangeText={setTime} 
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <Ionicons name="card-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Continuar al Pago</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  contentWrapper: { padding: 20, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  card: { width: '100%', maxWidth: 550, backgroundColor: '#fff', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  iconWrapper: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 16 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 4 },
  subHeader: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: '#334155' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, paddingHorizontal: 12, marginBottom: 16, height: 48 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: '100%', fontSize: 15, color: '#0f172a' },
  button: { flexDirection: 'row', backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});