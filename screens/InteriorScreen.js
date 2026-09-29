import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function InteriorScreen({ route, navigation }) {
  const { service = 'Servicio Completo', price = 250, vehicle = 'Sedán' } = route.params || {};

  const handleNext = (includeExtra) => {
    const extraCost = includeExtra ? 200 : 0;
    const finalPrice = price + extraCost;
    const finalService = includeExtra ? `${service} + Limpieza Interior` : service;

    navigation.navigate('Cita', {
      service: finalService,
      price: finalPrice,
      vehicle: vehicle,
      extraInterior: includeExtra,
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentWrapper}
    >
      <View style={styles.card}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepNumber}>PASO 3 DE 4</Text>
          <Text style={styles.header}>Servicio Adicional de Interior</Text>
        </View>

        <View style={styles.iconContainer}>
          <Ionicons name="sparkles-outline" size={44} color="#007AFF" />
        </View>

        <Text style={styles.title}>¿Deseas agregar Limpieza Profunda de Interiores?</Text>
        
        <Text style={styles.description}>
          Incluye aspirado exhaustivo de alfombras, asientos y cajuela, hidratación de plásticos del tablero y puertas, desinfección antibacteriana de ductos de aire acondicionado y aromatizante premium.
        </Text>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Vehículo:</Text>
            <Text style={styles.summaryVal}>{vehicle}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Servicio base:</Text>
            <Text style={styles.summaryVal}>{service}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Subtotal actual:</Text>
            <Text style={[styles.summaryVal, { color: '#007AFF', fontWeight: 'bold' }]}>${price} MXN</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleNext(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Agregar Limpieza de Interior (+$200 MXN)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => handleNext(false)}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Continuar sin servicio interior</Text>
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
    flexGrow: 1,
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  stepHeader: {
    marginBottom: 16,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: { 
    fontSize: 14, 
    color: '#64748b', 
    textAlign: 'center', 
    marginBottom: 20, 
    lineHeight: 22, 
  },
  summaryBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  summaryVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  button: { 
    flexDirection: 'row',
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 12, 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  secondaryButton: { 
    backgroundColor: 'transparent', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: { 
    color: '#475569', 
    fontSize: 15, 
    fontWeight: '600' 
  },
});