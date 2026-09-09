import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function PagoScreen({ route, navigation }) {
  const { service, price, vehicle, date, time } = route.params || {
    service: 'Lavado General',
    price: 250,
    vehicle: 'Sedán',
    date: '2026-09-10',
    time: '10:00 AM'
  };

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #007AFF; padding-bottom: 10px; }
            .title { color: #007AFF; margin: 0; }
            .details { margin-top: 20px; width: 100%; border-collapse: collapse; }
            .details td { padding: 10px; border-bottom: 1px solid #ddd; }
            .total { text-align: right; margin-top: 20px; font-size: 20px; font-weight: bold; color: #10b981; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">PERFECT SHINE CAR WASH</h1>
            <p>Comprobante Oficial de Reserva</p>
          </div>
          
          <h3>Detalles de la Cita</h3>
          <table class="details">
            <tr><td><strong>Titular:</strong></td><td>${cardName}</td></tr>
            <tr><td><strong>Tipo de Vehículo:</strong></td><td>${vehicle}</td></tr>
            <tr><td><strong>Servicio Agendado:</strong></td><td>${service}</td></tr>
            <tr><td><strong>Fecha:</strong></td><td>${date}</td></tr>
            <tr><td><strong>Horario:</strong></td><td>${time}</td></tr>
            <tr><td><strong>Estado:</strong></td><td>Pagado (Tarjeta **** ${cardNumber.slice(-4)})</td></tr>
          </table>

          <div class="total">
            Total Pagado: $${price} MXN
          </div>

          <div class="footer">
            <p>¡Gracias por confiar en Perfect Shine!</p>
            <p>Presenta este comprobante al momento de llevar tu vehículo.</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el recibo en PDF.');
    }
  };

  const handlePay = () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      Alert.alert('Campos incompletos', 'Por favor llena los datos de tu tarjeta.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      Alert.alert(
        '¡Pago Exitoso!',
        'Tu cita ha sido reservada correctamente. Se descargarás el recibo en PDF.',
        [
          {
            text: 'Descargar PDF',
            onPress: async () => {
              await generatePDF();
              navigation.navigate('Inicio');
            }
          }
        ]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Método de Pago</Text>

      {/* Resumen Final */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen del Cobro</Text>
        <Text style={styles.cardText}>Vehículo: <Text style={styles.bold}>{vehicle}</Text></Text>
        <Text style={styles.cardText}>Servicio: <Text style={styles.bold}>{service}</Text></Text>
        <Text style={styles.cardText}>Fecha y Hora: <Text style={styles.bold}>{date} - {time}</Text></Text>
        <Text style={styles.priceText}>Total: ${price} MXN</Text>
      </View>

      {/* Formulario de Tarjeta */}
      <Text style={styles.label}>Nombre en la Tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="Juan Pérez"
        value={cardName}
        onChangeText={setCardName}
      />

      <Text style={styles.label}>Número de Tarjeta</Text>
      <TextInput
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        maxLength={16}
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.label}>Expiración (MM/AA)</Text>
          <TextInput
            style={styles.input}
            placeholder="12/28"
            maxLength={5}
            value={expiry}
            onChangeText={setExpiry}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            value={cvv}
            onChangeText={setCvv}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }} />
      ) : (
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Pagar y Generar PDF</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 15 },
  card: { backgroundColor: '#f8fafc', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#1e293b' },
  cardText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#007AFF' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#10b981', marginTop: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 15 },
  row: { flexDirection: 'row' },
  payButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  payButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});