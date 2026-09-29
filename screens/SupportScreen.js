import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SupportScreen() {
  const handleCall = () => Linking.openURL('tel:+522221234567');
  const handleWhatsApp = () => Linking.openURL('https://wa.me/522221234567?text=Hola,%20necesito%20soporte%20con%20mi%20cita');
  const handleEmail = () => Linking.openURL('mailto:soporte@perfectshine.com?subject=Atención%20al%20Cliente');
  const handleMap = () => Linking.openURL('https://maps.google.com/?q=CarWash+Perfect+Shine');

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.responsiveContent}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Centro de Soporte y Atención</Text>
          <Text style={styles.subHeader}>
            ¿Tienes dudas con tu reserva, sugerencias o necesitas atención personalizada? Nuestro equipo de soporte está disponible para asistirte.
          </Text>
        </View>

        {/* Opciones de Contacto Directo */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="chatbubbles-outline" size={20} color="#007AFF" />
            <Text style={styles.cardTitle}>Canales Directos de Atención</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#25D366' }]} 
            onPress={handleWhatsApp}
            activeOpacity={0.8}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText}>Enviar Mensaje por WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#007AFF' }]} 
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Ionicons name="call-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText}>Llamada Telefónica Directa</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#ea4335' }]} 
            onPress={handleEmail}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={20} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText}>Enviar Correo Electrónico</Text>
          </TouchableOpacity>
        </View>

        {/* Ubicación del Autolavado */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="business-outline" size={20} color="#007AFF" />
            <Text style={styles.cardTitle}>Instalaciones y Sucursal</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color="#64748b" style={styles.rowIcon} />
            <Text style={styles.cardBody}>
              Av. Principal #123, Col. Centro, San Pablo del Monte / Puebla.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={18} color="#64748b" style={styles.rowIcon} />
            <Text style={styles.cardSchedule}>
              Horario de Atención: Lunes a Sábado de 8:00 AM a 7:00 PM
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.btn, { backgroundColor: '#0f172a', marginTop: 14 }]} 
            onPress={handleMap}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate-outline" size={18} color="#fff" style={styles.btnIcon} />
            <Text style={styles.btnText}>Abrir Ubicación en Google Maps</Text>
          </TouchableOpacity>
        </View>

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
    padding: 20,
    alignItems: 'center',
  },
  responsiveContent: {
    width: '100%',
    maxWidth: 750,
  },
  headerBox: {
    marginBottom: 20,
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
    lineHeight: 22, 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 14, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rowIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  cardBody: { 
    fontSize: 14, 
    color: '#334155', 
    lineHeight: 20,
    flex: 1,
  },
  cardSchedule: { 
    fontSize: 13, 
    color: '#64748b', 
    fontWeight: '500',
    flex: 1,
  },
  btn: { 
    flexDirection: 'row',
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 10, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnIcon: {
    marginRight: 8,
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14, 
  },
});