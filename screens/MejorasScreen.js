import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const SERVICES = [
  { id: '1', name: 'Lavado Básico', price: 150, priceText: '$150 MXN' },
  { id: '2', name: 'Lavado Completo + Cera', price: 280, priceText: '$280 MXN' },
  { id: '3', name: 'Detallado Exterior', price: 450, priceText: '$450 MXN' },
];

export default function MejorasScreen({ route, navigation }) {
  // Recibimos los datos del vehículo de la pantalla anterior (ModelsScreen)
  const { vehicle = 'Sedán', basePrice = 0 } = route.params || {};

  const handleSelectService = (item) => {
    // Calculamos el costo total acumulado (precio por vehículo + precio del servicio)
    const totalPrice = basePrice + item.price;

    // Pasamos el paquete y el acumulado a InteriorScreen
    navigation.navigate('Interior', {
      service: item.name,
      price: totalPrice,
      vehicle: vehicle,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Paso 2: Elige el paquete de lavado</Text>
      <Text style={styles.subHeader}>Vehículo seleccionado: <Text style={styles.bold}>{vehicle}</Text></Text>

      <FlatList
        data={SERVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => handleSelectService(item)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
            </View>
            <Text style={styles.cardPrice}>{item.priceText}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: '#0f172a' },
  subHeader: { fontSize: 14, color: '#64748b', marginBottom: 20 },
  bold: { color: '#007AFF', fontWeight: 'bold' },
  card: { 
    padding: 18, 
    backgroundColor: '#f8fafc', 
    borderRadius: 10, 
    marginBottom: 12, 
    flexDirection: 'row', 
    justify: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e2e8f0' 
  },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
});