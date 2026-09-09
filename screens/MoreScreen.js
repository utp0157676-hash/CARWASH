import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Acerca de CarWash</Text>
      <Text style={styles.text}>Versión 1.0.0</Text>
      <Text style={styles.text}>Términos y Condiciones</Text>
      <Text style={styles.text}>Política de Privacidad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  text: { fontSize: 15, color: '#444', marginVertical: 8 },
});