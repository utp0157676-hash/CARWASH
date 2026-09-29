import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VEHICLES = [
  { 
    id: '1', 
    name: 'Sedán / Coche', 
    description: 'Automóviles compactos, sedanes y hatchbacks',
    basePrice: 0,
    image: require('../assets/sedan.png') 
  },
  { 
    id: '2', 
    name: 'SUV / Camioneta', 
    description: 'Camionetas medianas, crossovers y minivans',
    basePrice: 50,
    image: require('../assets/camioneta.png') 
  },
  { 
    id: '3', 
    name: 'Pick-up / Camión', 
    description: 'Camionetas de batea, pickups y vehículos grandes',
    basePrice: 80,
    image: require('../assets/pickup.png') 
  },
];

export default function ModelsScreen({ navigation }) {
  const handleSelect = (vehicleItem) => {
    navigation.navigate('Mejoras', { 
      vehicle: vehicleItem.name, 
      model: vehicleItem.name,
      basePrice: vehicleItem.basePrice || 0,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepNumber}>PASO 1 DE 4</Text>
          <Text style={styles.header}>Selecciona tu tipo de vehículo</Text>
          <Text style={styles.subHeader}>Elige la categoría para calcular las proporciones y productos adecuados</Text>
        </View>

        <FlatList
          data={VEHICLES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => handleSelect(item)}
              activeOpacity={0.85}
            >
              <Image source={item.image} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardText}>{item.name}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward-circle" size={28} color="#007AFF" />
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
    marginBottom: 6,
  },
  subHeader: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 14, 
    marginBottom: 16, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: { 
    width: '100%', 
    height: 150, 
    resizeMode: 'cover',
  },
  cardInfo: { 
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1e293b',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
  },
});