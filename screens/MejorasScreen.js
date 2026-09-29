import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SERVICES = [
  { 
    id: '1', 
    name: 'Lavado Básico', 
    description: 'Lavado exterior con shampoo espumoso, limpieza de rines y secado con microfibra.',
    price: 150, 
    priceText: '$150 MXN' 
  },
  { 
    id: '2', 
    name: 'Lavado Completo + Cera', 
    description: 'Lavado con espuma activa, abrillantador de llantas y aplicación de cera líquida protectora.',
    price: 280, 
    priceText: '$280 MXN' 
  },
  { 
    id: '3', 
    name: 'Detallado Exterior', 
    description: 'Descontaminado de pintura, abrillantado cerámico, sellador de rines y restauración de plásticos.',
    price: 450, 
    priceText: '$450 MXN' 
  },
];

export default function MejorasScreen({ route, navigation }) {
  const { vehicle = route.params?.model || 'Sedán', basePrice = 0 } = route.params || {};

  const handleSelectService = (item) => {
    const totalPrice = basePrice + item.price;

    navigation.navigate('Interior', {
      service: item.name,
      price: totalPrice,
      vehicle: vehicle,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepNumber}>PASO 2 DE 4</Text>
          <Text style={styles.header}>Elige el paquete de lavado</Text>
          
          <View style={styles.vehicleBadge}>
            <Ionicons name="car-outline" size={16} color="#007AFF" />
            <Text style={styles.vehicleBadgeText}>Vehículo: <Text style={styles.bold}>{vehicle}</Text></Text>
          </View>
        </View>

        <FlatList
          data={SERVICES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => handleSelectService(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardLeft}>
                <View style={styles.serviceHeader}>
                  <Ionicons name="water-outline" size={20} color="#007AFF" style={{ marginRight: 6 }} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.cardPrice}>{item.priceText}</Text>
                <View style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Elegir</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  responsiveWrapper: {
    width: '100%',
    maxWidth: 750,
    flex: 1,
    padding: 20,
  },
  stepHeader: {
    marginBottom: 20,
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
    marginBottom: 10,
  },
  vehicleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  vehicleBadgeText: { 
    fontSize: 13, 
    color: '#1e40af',
    marginLeft: 6,
  },
  bold: { 
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  card: { 
    padding: 18, 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    marginBottom: 14, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 15,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#0f172a' 
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cardPrice: { 
    fontSize: 17, 
    fontWeight: '800', 
    color: '#007AFF',
    marginBottom: 8,
  },
  selectButton: {
    backgroundColor: '#eff6ff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});