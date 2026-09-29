import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { showAlert } from '../utils/platformAlert';

const AVAILABLE_TIMES = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

export default function CitaScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const { service = 'Lavado General', price = 250, vehicle = 'Sedán' } = route.params || {};

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [saving, setSaving] = useState(false);

  const handleConfirmAppointment = async () => {
    if (!selectedDate) {
      showAlert('Selecciona una fecha', 'Por favor elige un día en el calendario para tu cita.');
      return;
    }

    if (!selectedTime) {
      showAlert('Selecciona un horario', 'Por favor elige una hora para tu cita.');
      return;
    }

    setSaving(true);

    try {
      // Estructura de la cita para guardar en Firestore
      const appointmentData = {
        userId: user ? user.uid : 'invitado',
        clientEmail: user ? user.email : 'invitado@carwash.com',
        clientName: user ? (user.name || user.username || 'Cliente') : 'Cliente Invitado',
        vehicle: vehicle,
        service: service,
        price: Number(price),
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        status: 'Pendiente',
        paid: false,
        createdAt: new Date().toISOString(),
      };

      // Guardar en la colección 'citas' de Firebase
      const docRef = await addDoc(collection(db, 'citas'), appointmentData);

      setSaving(false);

      // Redirigir a la pantalla de Pago con ID real de Firestore
      navigation.navigate('Pago', {
        appointmentId: docRef.id,
        ...appointmentData,
      });

    } catch (error) {
      setSaving(false);
      console.error('Error al guardar cita en Firestore:', error);
      showAlert('Error en Firestore', 'No se pudo registrar la cita en la base de datos: ' + (error.message || error));
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.responsiveContent}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepNumber}>PASO 4 DE 4</Text>
          <Text style={styles.header}>Elige Fecha y Horario de Atención</Text>
          <Text style={styles.subHeader}>Selecciona el día y horario que mejor se adapte a tu itinerario</Text>
        </View>
        
        {/* Calendario */}
        <View style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            minDate={todayStr}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#007AFF', selectedTextColor: '#ffffff' }
            }}
            theme={{
              todayTextColor: '#007AFF',
              arrowColor: '#007AFF',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              selectedDayBackgroundColor: '#007AFF',
              selectedDayTextColor: '#ffffff',
            }}
          />
        </View>

        {/* Horarios Disponibles */}
        <Text style={styles.subSectionTitle}>
          Horarios disponibles para el {selectedDate}:
        </Text>
        <View style={styles.timeGrid}>
          {AVAILABLE_TIMES.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.timeChip, isSelected && styles.timeChipSelected]}
                onPress={() => setSelectedTime(time)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="time-outline" 
                  size={16} 
                  color={isSelected ? '#ffffff' : '#475569'} 
                  style={{ marginRight: 6 }} 
                />
                <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Resumen del Servicio sin emojis */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt-outline" size={20} color="#007AFF" />
            <Text style={styles.summaryTitle}>Resumen de tu Cita</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="car-outline" size={18} color="#64748b" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Vehículo:</Text>
            <Text style={styles.rowValue}>{vehicle}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="water-outline" size={18} color="#64748b" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Servicio:</Text>
            <Text style={styles.rowValue}>{service}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="calendar-outline" size={18} color="#64748b" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Fecha:</Text>
            <Text style={styles.rowValue}>{selectedDate}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Ionicons name="time-outline" size={18} color="#64748b" style={styles.rowIcon} />
            <Text style={styles.rowLabel}>Horario:</Text>
            <Text style={styles.rowValue}>{selectedTime || 'Sin seleccionar'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total a Pagar:</Text>
            <Text style={styles.priceValue}>${price} MXN</Text>
          </View>
        </View>

        {/* Botón de Continuar */}
        <TouchableOpacity 
          style={[styles.btn, saving && { backgroundColor: '#94a3b8' }]}
          onPress={handleConfirmAppointment}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="card-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Continuar a Método de Pago</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
  },
  contentWrapper: {
    padding: 16,
    alignItems: 'center',
  },
  responsiveContent: {
    width: '100%',
    maxWidth: 750,
  },
  stepHeader: {
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 1,
    marginBottom: 4,
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    marginBottom: 6, 
  },
  subHeader: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  subSectionTitle: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#334155', 
    marginBottom: 12, 
  },
  timeGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10, 
    marginBottom: 22, 
  },
  timeChip: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, 
    paddingHorizontal: 16, 
    backgroundColor: '#ffffff', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  timeChipSelected: { 
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeText: { 
    color: '#334155', 
    fontWeight: '600',
    fontSize: 14,
  },
  timeTextSelected: { 
    color: '#fff',
    fontWeight: 'bold',
  },
  summaryCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#0f172a',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowIcon: {
    marginRight: 8,
  },
  rowLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 85,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#007AFF',
  },
  btn: { 
    flexDirection: 'row',
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  btnText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});