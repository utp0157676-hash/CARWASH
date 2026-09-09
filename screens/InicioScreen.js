import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Linking 
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const BANNERS = [
  { id: '1', title: 'Encerado Profesional', img: require('../assets/encerado.png') },
  { id: '2', title: 'Limpieza de Interiores', img: require('../assets/interiores.png') },
  { id: '3', title: 'Pulido y Detallado', img: require('../assets/pulido.png') },
];

export default function InicioScreen({ navigation }) {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carrusel Automático
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % BANNERS.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + 15),
        animated: true,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const openSocial = (url) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* 1. Sección Superior: Presentación */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🚘 Bienvenido a Perfect Shine</Text>
        <Text style={styles.infoText}>
          Revolucionamos el cuidado automotriz ofreciendo servicios de lavado premium con tecnología ecofriendly y productos de alta gama.
        </Text>
      </View>

      {/* 2. Sección Central: Carrusel en el Medio */}
      <Text style={styles.sectionTitle}>Nuestros Trabajos y Resultados</Text>
      <View style={styles.carouselContainer}>
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 15}
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContent}
        >
          {BANNERS.map((banner) => (
            <View key={banner.id} style={styles.bannerCard}>
              <Image source={banner.img} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerText}>{banner.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 3. Botón de Acción Principal */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Servicios')}
      >
        <Text style={styles.actionButtonText}>✨ Agendar un Servicio Ahora</Text>
      </TouchableOpacity>

      {/* 4. Pie de Página con Redes Sociales y Derechos Reservados */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Síguenos en nuestras redes</Text>
        
        <View style={styles.socialRow}>
          <TouchableOpacity 
            style={[styles.socialChip, { backgroundColor: '#1877F2' }]} 
            onPress={() => openSocial('https://facebook.com')}
          >
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialChip, { backgroundColor: '#E4405F' }]} 
            onPress={() => openSocial('https://instagram.com')}
          >
            <Text style={styles.socialText}>Instagram</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.socialChip, { backgroundColor: '#000000' }]} 
            onPress={() => openSocial('https://tiktok.com')}
          >
            <Text style={styles.socialText}>TikTok</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © 2026 Perfect Shine CarWash. Todos los derechos reservados.
        </Text>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 15 },
  
  infoCard: { backgroundColor: '#fff', padding: 18, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 15, marginBottom: 20 },
  infoTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  infoText: { color: '#64748b', fontSize: 14, lineHeight: 20 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 12, textAlign: 'center' },
  
  carouselContainer: { height: 200, marginBottom: 20 },
  carouselContent: { alignItems: 'center' },
  bannerCard: { width: CARD_WIDTH, height: 190, borderRadius: 14, overflow: 'hidden', marginRight: 15, backgroundColor: '#000' },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', padding: 12 },
  bannerText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  actionButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 25 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  footer: { backgroundColor: '#0f172a', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  footerTitle: { color: '#94a3b8', fontSize: 13, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 12 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 15 },
  socialChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  socialText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  copyright: { color: '#64748b', fontSize: 11, textAlign: 'center' },
});