import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../AuthContext';
import { generateAndShareReceipt } from '../utils/receiptPdf';

export default function ReciboScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const params = route.params || {};

  const appointmentId = params.appointmentId || 'PS-' + Math.floor(100000 + Math.random() * 900000);
  const transactionId = params.transactionId || 'TX-' + Math.floor(100000 + Math.random() * 900000);
  const service = params.service || 'Lavado General';
  const vehicle = params.vehicle || 'Sedán';
  const price = Number(params.price) || 250;
  const date = params.date || params.appointmentDate || '2026-09-10';
  const time = params.time || params.appointmentTime || '10:00 AM';
  const cardHolder = params.cardHolder || user?.name || user?.username || 'Cliente';
  const lastFourDigits = params.lastFourDigits || '4242';

  const handleDownloadPdf = async () => {
    await generateAndShareReceipt({
      clientName: cardHolder,
      vehicle,
      service,
      date,
      time,
      price,
      transactionId,
      appointmentId,
      lastFourDigits,
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <View style={styles.successIconWrapper}>
          <Ionicons name="checkmark-circle" size={64} color="#10b981" />
        </View>

        <Text style={styles.title}>¡Reservación Confirmada!</Text>
        <Text style={styles.subtitle}>
          Tu cita ha sido registrada exitosamente. Hemos guardado los detalles de tu servicio.
        </Text>

        <View style={styles.receiptBox}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptHeaderTitle}>COMPROBANTE DIGITAL</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PAGADO</Text>
            </View>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Folio de Cita:</Text>
            <Text style={[styles.receiptVal, styles.mono]}>{appointmentId}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>No. Transacción:</Text>
            <Text style={[styles.receiptVal, styles.mono]}>{transactionId}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Titular:</Text>
            <Text style={styles.receiptVal}>{cardHolder}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Vehículo:</Text>
            <Text style={styles.receiptVal}>{vehicle}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Servicio:</Text>
            <Text style={styles.receiptVal}>{service}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Fecha y Hora:</Text>
            <Text style={styles.receiptVal}>{date} - {time}</Text>
          </View>

          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Forma de Pago:</Text>
            <Text style={styles.receiptVal}>Tarjeta (**** {lastFourDigits})</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Pagado:</Text>
            <Text style={styles.totalAmount}>${price} MXN</Text>
          </View>
        </View>

        {/* Botones de acción */}
        <TouchableOpacity 
          style={styles.pdfButton}
          onPress={handleDownloadPdf}
          activeOpacity={0.8}
        >
          <Ionicons name="document-text-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.pdfButtonText}>Descargar / Imprimir PDF</Text>
        </TouchableOpacity>

        {user && (
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Citas')}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar-outline" size={18} color="#007AFF" style={{ marginRight: 8 }} />
            <Text style={styles.secondaryButtonText}>Ver Mis Citas Agendadas</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.linkButtonText}>Volver a la Pantalla de Inicio</Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  successIconWrapper: {
    marginBottom: 12,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 14, 
    color: '#64748b', 
    textAlign: 'center', 
    marginBottom: 20,
    lineHeight: 20,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 22,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
  },
  receiptHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#047857',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  receiptLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  receiptVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  mono: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },
  pdfButton: { 
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  pdfButtonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  secondaryButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});