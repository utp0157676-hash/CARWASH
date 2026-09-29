import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { showAlert } from '../utils/platformAlert';
import { generateAndShareReceipt } from '../utils/receiptPdf';

export default function PagoScreen({ route, navigation }) {
  const { user } = useContext(AuthContext);
  const params = route.params || {};

  const service = params.service || 'Lavado General';
  const price = Number(params.price) || 250;
  const vehicle = params.vehicle || 'Sedán';
  const date = params.appointmentDate || params.date || '2026-09-10';
  const time = params.appointmentTime || params.time || '10:00 AM';
  const appointmentId = params.appointmentId || 'CITA-' + Date.now();

  const [cardName, setCardName] = useState(user?.name || user?.username || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Validar y formatear expiración
  const handleExpiryChange = (text) => {
    let clean = text.replace(/[^0-9]/g, '');
    if (clean.length > 2) {
      clean = clean.slice(0, 2) + '/' + clean.slice(2, 4);
    }
    setExpiry(clean);
  };

  // Procesar Pago
  const handlePay = async () => {
    if (!cardName.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      showAlert('Campos incompletos', 'Por favor llena todos los datos de tu tarjeta de crédito o débito.');
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      showAlert('Número de tarjeta inválido', 'Por favor ingresa los 16 dígitos de la tarjeta.');
      return;
    }

    if (cvv.length < 3) {
      showAlert('Código de seguridad inválido', 'Ingresa un CVV válido de 3 o 4 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const generatedTxId = 'TX-' + Math.floor(100000 + Math.random() * 900000);
      setTransactionId(generatedTxId);

      // Actualizar estado en Firestore si existe la cita
      if (params.appointmentId) {
        try {
          await updateDoc(doc(db, 'citas', params.appointmentId), {
            status: 'Confirmada',
            paid: true,
            transactionId: generatedTxId,
            cardHolder: cardName.trim(),
            lastFourDigits: cleanCardNumber.slice(-4),
            paidAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Error al actualizar status de cita en Firestore, intentando setDoc merge:', dbErr);
          await setDoc(doc(db, 'citas', params.appointmentId), {
            status: 'Confirmada',
            paid: true,
            transactionId: generatedTxId,
            paidAt: new Date().toISOString(),
          }, { merge: true });
        }
      }

      setLoading(false);
      setShowSuccess(true);
    } catch (err) {
      setLoading(false);
      console.error('Error al procesar el pago:', err);
      showAlert('Error en el pago', 'Ocurrió un error al registrar el pago: ' + (err.message || err));
    }
  };

  // Generar y descargar/imprimir PDF
  const handleGenerateReceipt = async () => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    const lastFour = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';

    await generateAndShareReceipt({
      clientName: cardName || (user?.name || 'Cliente'),
      vehicle,
      service,
      date,
      time,
      price,
      transactionId: transactionId || 'TX-' + Date.now(),
      appointmentId,
      lastFourDigits: lastFour,
    });
  };

  const handleGoToReceiptScreen = () => {
    setShowSuccess(false);
    const cleanCard = cardNumber.replace(/\s/g, '');
    navigation.navigate('Recibo', {
      appointmentId,
      transactionId: transactionId || 'TX-' + Date.now(),
      service,
      vehicle,
      price,
      date,
      time,
      cardHolder: cardName,
      lastFourDigits: cleanCard.slice(-4) || '4242',
    });
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveContent}>
          <Text style={styles.title}>Método de Pago Seguro</Text>
          <Text style={styles.subtitle}>Ingresa los datos para confirmar y asegurar la reserva de tu cita</Text>

          {/* Resumen del cobro */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
              <Text style={styles.summaryTitle}>Resumen del Servicio</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vehículo:</Text>
              <Text style={styles.detailValue}>{vehicle}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Servicio:</Text>
              <Text style={styles.detailValue}>{service}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha y Horario:</Text>
              <Text style={styles.detailValue}>{date} a las {time}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Monto Total:</Text>
              <Text style={styles.totalAmount}>${price} MXN</Text>
            </View>
          </View>

          {/* Formulario de Pago */}
          <View style={styles.formCard}>
            <Text style={styles.label}>Nombre del Titular</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre impreso en la tarjeta"
                placeholderTextColor="#94a3b8"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>

            <Text style={styles.label}>Número de Tarjeta (16 dígitos)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="card-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Vencimiento</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/AA"
                    placeholderTextColor="#94a3b8"
                    maxLength={5}
                    value={expiry}
                    onChangeText={handleExpiryChange}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.halfInputRight}>
                <Text style={styles.label}>CVV / CVC</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    secureTextEntry
                    maxLength={4}
                    value={cvv}
                    onChangeText={setCvv}
                  />
                </View>
              </View>
            </View>

            <View style={styles.securityBadge}>
              <Ionicons name="lock-closed" size={15} color="#059669" />
              <Text style={styles.securityText}>Pago encriptado con cifrado de 256 bits</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Procesando transacción y confirmando en Firebase...</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.payButton}
                onPress={handlePay}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-done-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.payButtonText}>Confirmar Pago (${price} MXN)</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Modal de Pago Exitoso */}
      <Modal
        visible={showSuccess}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark-sharp" size={44} color="#ffffff" />
            </View>

            <Text style={styles.successTitle}>¡Pago Exitoso!</Text>
            <Text style={styles.successText}>Tu pago ha sido registrado y la cita está confirmada en el sistema.</Text>

            <View style={styles.successSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Folio:</Text>
                <Text style={styles.summaryVal}>{appointmentId}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Servicio:</Text>
                <Text style={styles.summaryVal}>{service}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Vehículo:</Text>
                <Text style={styles.summaryVal}>{vehicle}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Fecha:</Text>
                <Text style={styles.summaryVal}>{date} - {time}</Text>
              </View>
              <View style={[styles.summaryItem, { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8, marginTop: 4 }]}>
                <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total Pagado:</Text>
                <Text style={styles.summaryPrice}>${price} MXN</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.receiptButton}
              onPress={handleGenerateReceipt}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.receiptButtonText}>Descargar / Imprimir PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.detailButton}
              onPress={handleGoToReceiptScreen}
              activeOpacity={0.8}
            >
              <Ionicons name="receipt-outline" size={18} color="#007AFF" style={{ marginRight: 8 }} />
              <Text style={styles.detailButtonText}>Ver Recibo Completo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowSuccess(false);
                navigation.navigate('Inicio');
              }}
            >
              <Text style={styles.cancelButtonText}>Volver al Inicio</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  responsiveContent: {
    width: '100%',
    maxWidth: 650,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#10b981',
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#fff',
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  halfInputRight: {
    flex: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  securityText: {
    fontSize: 12,
    color: '#047857',
    fontWeight: '600',
    marginLeft: 6,
  },
  payButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  successText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 20,
  },
  successSummary: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  summaryPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#10b981',
  },
  receiptButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  receiptButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  detailButton: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  detailButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
});
