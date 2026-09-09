import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';

const AVAILABLE_TIMES = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

export default function CitaScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { service = 'Lavado General', price = 250, vehicle = 'Sedán' } = route.params || {};

  const [selectedDate, setSelectedDate] = useState('2026-09-10');
  const [selectedTime, setSelectedTime] = useState('');
  const [saving, setSaving] = useState(false);

  const handleConfirmAppointment = async () => {
    if (!selectedTime) {
      Alert.alert('Selecciona un horario', 'Por favor elige una hora para tu cita.');
      return;
    }

    setSaving(true);

    try {
      // Estructura de la cita para guardar en Firestore
      const appointmentData = {
        userId: user ? user.uid : 'invitado',
        clientEmail: user ? user.email : 'Sin correo',
        clientName: user ? (user.name || 'Cliente') : 'Invitado',
        vehicle: vehicle,
        service: service,
        price: price,
        appointmentDate: selectedDate, // Fecha del servicio
        appointmentTime: selectedTime, // Horario seleccionado
        status: 'Pendiente',
        createdAt: new Date().toISOString(),
      };

      // Guardar en la colección 'citas' de Firebase
      const docRef = await addDoc(collection(db, 'citas'), appointmentData);

      setSaving(false);

      // Redirigir a la pantalla de Pago
      navigation.navigate('Pago', {
        appointmentId: docRef.id,
        ...appointmentData,
      });

    } catch (error) {
      setSaving(false);
      Alert.alert('Error', 'No se pudo guardar la cita en Firebase: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Paso 4: Elige Fecha y Horario</Text>
      
      {/* Calendario 2026 */}
      <Calendar
        current={'2026-09-10'}
        minDate={'2026-09-01'}
        maxDate={'2026-12-31'}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#007AFF' }
        }}
        theme={{
          todayTextColor: '#007AFF',
          arrowColor: '#007AFF',
        }}
      />

      {/* Horarios Disponibles */}
      <Text style={styles.subHeader}>Horarios Disponibles para {selectedDate}:</Text>
      <View style={styles.timeGrid}>
        {AVAILABLE_TIMES.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeChip, selectedTime === time && styles.timeChipSelected]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.timeText, selectedTime === time && styles.timeTextSelected]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Resumen del Servicio */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen de tu Cita</Text>
        <Text style={styles.summaryText}>🚗 Vehículo: {vehicle}</Text>
        <Text style={styles.summaryText}>🧽 Servicio: {service}</Text>
        <Text style={styles.summaryText}>📅 Fecha: {selectedDate}</Text>
        <Text style={styles.summaryText}>⏰ Hora: {selectedTime || 'Sin seleccionar'}</Text>
        <Text style={styles.priceText}>Total: ${price} MXN</Text>
      </View>

      {/* Botón de Continuar */}
      <TouchableOpacity 
        style={[styles.btn, saving && { backgroundColor: '#94a3b8' }]}
        onPress={handleConfirmAppointment}
        disabled={saving}
      >
        <Text style={styles.btnText}>
          {saving ? 'Guardando en Firebase...' : 'Continuar a Método de Pago'}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 15, textAlign: 'center' },
  subHeader: { fontSize: 15, fontWeight: 'bold', color: '#334155', marginTop: 15, marginBottom: 10 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeChip: { paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#e2e8f0', borderRadius: 8 },
  timeChipSelected: { backgroundColor: '#007AFF' },
  timeText: { color: '#334155', fontWeight: 'bold' },
  timeTextSelected: { color: '#fff' },
  summaryCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 20 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  summaryText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginTop: 8 },
  btn: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});