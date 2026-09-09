import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';

const VEHICLES = [
  { 
    id: '1', 
    name: 'Sedán / Coche', 
    image: require('../assets/sedan.png') 
  },
  { 
    id: '2', 
    name: 'SUV / Camioneta', 
    image: require('../assets/camioneta.png') 
  },
  { 
    id: '3', 
    name: 'Pick-up / Camión', 
    image: require('../assets/pickup.png') 
  },
];

export default function ModelsScreen({ navigation }) {
  const handleSelect = (model) => {
    navigation.navigate('Mejoras', { model });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Paso 1: Selecciona tu tipo de vehículo</Text>
      <FlatList
        data={VEHICLES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item.name)}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  card: { backgroundColor: '#f8fafc', borderRadius: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', elevation: 2 },
  cardImage: { width: '100%', height: 140, resizeMode: 'cover' },
  cardInfo: { padding: 15 },
  cardText: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
});