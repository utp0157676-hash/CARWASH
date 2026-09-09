import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function InteriorScreen({ route, navigation }) {
  // Recibimos los datos acumulados de los pasos anteriores (o valores por defecto)
  const { service = 'Servicio Completo', price = 250, vehicle = 'Sedán' } = route.params || {};

  const handleNext = (includeExtra) => {
    const extraCost = includeExtra ? 200 : 0;
    const finalPrice = price + extraCost;
    const finalService = includeExtra ? `${service} + Limpieza Interior` : service;

    // Navegamos a 'Cita' (Calendario 2026 y Selección de Horario)
    navigation.navigate('Cita', {
      service: finalService,
      price: finalPrice,
      vehicle: vehicle,
      extraInterior: includeExtra,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Paso 3: Servicios Adicionales de Interior</Text>
      <Text style={styles.description}>
        ¿Deseas incluir aspirado profundo y desinfección de vestiduras con vapor?
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => handleNext(true)}
      >
        <Text style={styles.buttonText}>Agregar Limpieza de Interior (+$200)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]}
        onPress={() => handleNext(false)}
      >
        <Text style={styles.secondaryButtonText}>Omitir este paso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#0f172a' },
  description: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
});