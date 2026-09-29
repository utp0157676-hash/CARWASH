import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { showAlert } from '../utils/platformAlert';

export default function MyCarScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [brand, setBrand] = useState('Nissan');
  const [model, setModel] = useState('Versa Advance');
  const [plates, setPlates] = useState('ABC-1234');
  const [color, setColor] = useState('Gris Platino');
  const [year, setYear] = useState('2024');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos del auto desde Firestore
  useEffect(() => {
    const fetchVehicle = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const vehicleDoc = await getDoc(doc(db, 'vehicles', user.uid));
        if (vehicleDoc.exists()) {
          const data = vehicleDoc.data();
          if (data.brand) setBrand(data.brand);
          if (data.model) setModel(data.model);
          if (data.plates) setPlates(data.plates);
          if (data.color) setColor(data.color);
          if (data.year) setYear(data.year);
        }
      } catch (err) {
        console.warn('Error al cargar vehículo desde Firestore:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [user]);

  // Guardar datos en Firestore
  const handleSaveVehicle = async () => {
    if (!user) {
      showAlert('Sesión Requerida', 'Debes iniciar sesión para guardar la información de tu vehículo.');
      return;
    }

    if (!model.trim() || !plates.trim()) {
      showAlert('Campos obligatorios', 'Por favor ingresa al menos el modelo y las placas del vehículo.');
      return;
    }

    setSaving(true);
    try {
      await setDoc(doc(db, 'vehicles', user.uid), {
        userId: user.uid,
        brand: brand.trim(),
        model: model.trim(),
        plates: plates.trim().toUpperCase(),
        color: color.trim(),
        year: year.trim(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      showAlert('Datos Guardados', 'La información de tu vehículo se actualizó en Firestore.');
    } catch (err) {
      console.error('Error al guardar vehículo:', err);
      showAlert('Error en Firestore', 'No se pudieron guardar los datos: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.responsiveContent}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>Mi Vehículo Registrado</Text>
          <Text style={styles.subHeader}>
            Configura y actualiza los datos de tu auto para agilizar tus próximas citas
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Cargando información del vehículo...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="car-sport-outline" size={44} color="#007AFF" />
            </View>

            <Text style={styles.label}>Marca del Automóvil</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="car-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Nissan, Volkswagen, Toyota"
                placeholderTextColor="#94a3b8"
                value={brand}
                onChangeText={setBrand}
              />
            </View>

            <Text style={styles.label}>Modelo y Versión</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="hardware-chip-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Versa Advance, Jetta GLI"
                placeholderTextColor="#94a3b8"
                value={model}
                onChangeText={setModel}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Placas</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="barcode-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="ABC-1234"
                    placeholderTextColor="#94a3b8"
                    value={plates}
                    onChangeText={setPlates}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.halfInputRight}>
                <Text style={styles.label}>Año</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={18} color="#64748b" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="2024"
                    placeholderTextColor="#94a3b8"
                    value={year}
                    onChangeText={setYear}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Color de la Carrocería</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="color-palette-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ej: Gris Platino, Blanco Perla, Rojo"
                placeholderTextColor="#94a3b8"
                value={color}
                onChangeText={setColor}
              />
            </View>

            <TouchableOpacity 
              style={styles.saveBtn}
              onPress={handleSaveVehicle}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.saveBtnText}>Guardar en Firestore</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
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
  },
  responsiveContent: {
    width: '100%',
    maxWidth: 650,
  },
  headerBox: {
    marginBottom: 20,
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
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 22, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
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
  saveBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});