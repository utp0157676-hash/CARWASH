import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function SupportScreen() {
  const handleCall = () => Linking.openURL('tel:+522221234567');
  const handleWhatsApp = () => Linking.openURL('https://wa.me/522221234567?text=Hola,%20necesito%20soporte%20con%20mi%20cita');
  const handleEmail = () => Linking.openURL('mailto:soporte@perfectshine.com?subject=Atención%20al%20Cliente');
  const handleMap = () => Linking.openURL('https://maps.google.com/?q=CarWash+Perfect+Shine');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Centro de Soporte y Atención</Text>
      <Text style={styles.subHeader}>
        ¿Tienes dudas con tu reserva, sugerencias o necesitas atención personalizada? Ponte en contacto con nosotros.
      </Text>

      {/* Opciones de Contacto Directo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Canales Directos</Text>
        
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
          <Text style={styles.btnText}>💬 Enviar mensaje por WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: '#007AFF' }]} onPress={handleCall}>
          <Text style={styles.btnText}>📞 Llamada Telefónica Directa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { backgroundColor: '#ea4335' }]} onPress={handleEmail}>
          <Text style={styles.btnText}>✉️ Enviar Correo Electrónico</Text>
        </TouchableOpacity>
      </View>

      {/* Ubicación del Autolavado */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📍 Nuestra Ubicación</Text>
        <Text style={styles.cardBody}>
          Av. Principal #123, Col. Centro, San Pablo del Monte / Puebla.
        </Text>
        <Text style={styles.cardSchedule}>
          🕒 Horario de Atención: Lunes a Sábado de 8:00 AM a 7:00 PM
        </Text>
        
        <TouchableOpacity style={[styles.btn, { backgroundColor: '#0f172a', marginTop: 12 }]} onPress={handleMap}>
          <Text style={styles.btnText}>🗺️ Abrir Ubicación en GPS / Google Maps</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  subHeader: { fontSize: 14, color: '#64748b', marginBottom: 20, lineHeight: 20 },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#1e293b', marginBottom: 12 },
  cardBody: { fontSize: 14, color: '#334155', marginBottom: 6 },
  cardSchedule: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});