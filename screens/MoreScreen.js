import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.responsiveContent}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Acerca de CARWASH</Text>
          <Text style={styles.subHeader}>
            Información sobre la plataforma, términos de uso y especificaciones técnicas
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="information-circle-outline" size={22} color="#007AFF" />
            <Text style={styles.cardTitle}>Especificaciones del Sistema</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Plataforma:</Text>
            <Text style={styles.infoVal}>CARWASH Multiplataforma (Web / Android / iOS)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Versión:</Text>
            <Text style={styles.infoVal}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Framework:</Text>
            <Text style={styles.infoVal}>React Native 0.86 / Expo SDK 57 / React Native Web</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Backend en la Nube:</Text>
            <Text style={styles.infoVal}>Google Firebase (Auth & Cloud Firestore)</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="document-text-outline" size={22} color="#007AFF" />
            <Text style={styles.cardTitle}>Términos y Condiciones</Text>
          </View>
          <Text style={styles.paragraph}>
            El agendamiento de citas a través de Perfect Shine CarWash reserva el espacio de atención en la sucursal seleccionada. Los pagos realizados mediante la plataforma generan un folio único de comprobante digital verificable.
          </Text>
          <Text style={styles.paragraph}>
            Para modificaciones o cancelaciones de citas agendadas, el usuario puede realizarlas desde la sección Mis Citas con un tiempo mínimo de anticipación.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="shield-checkmark-outline" size={22} color="#007AFF" />
            <Text style={styles.cardTitle}>Política de Privacidad y Seguridad</Text>
          </View>
          <Text style={styles.paragraph}>
            Los datos de autenticación y transacciones son resguardados mediante protocolos de cifrado y autenticación tokenizada provistos por Google Firebase. La información de los vehículos registrados es de uso exclusivo para la gestión de servicios.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="school-outline" size={22} color="#007AFF" />
            <Text style={styles.cardTitle}>Proyecto Académico</Text>
          </View>
          <Text style={styles.paragraph}>
            Universidad Tecnológica de Puebla
          </Text>
          <Text style={styles.subText}>
            Ingeniería en Gestión y Desarrollo de Software
          </Text>
          <Text style={styles.subText}>
            Asignatura: Aplicaciones Multiplataforma
          </Text>
          <Text style={styles.subText}>
            Desarrollado por: Marian Dessire Peralta Peralta
          </Text>
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
    lineHeight: 20,
  },
  card: { 
    backgroundColor: '#ffffff', 
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoKey: {
    width: 140,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  infoVal: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
  },
  paragraph: { 
    fontSize: 13, 
    color: '#475569', 
    lineHeight: 20,
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
});