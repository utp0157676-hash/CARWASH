import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  useWindowDimensions, 
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BANNERS = [
  { id: '1', title: 'Encerado Profesional', img: require('../assets/encerado.png') },
  { id: '2', title: 'Limpieza de Interiores', img: require('../assets/interiores.png') },
  { id: '3', title: 'Pulido y Detallado', img: require('../assets/pulido.png') },
];

export default function InicioScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.85, 460);

  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Carrusel Automático responsive
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % BANNERS.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (cardWidth + 15),
        animated: true,
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [currentIndex, cardWidth]);

  const openSocial = (url) => Linking.openURL(url);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentWrapper}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.responsiveContent}>
        {/* 1. Sección Superior: Presentación */}
        <View style={styles.infoCard}>
          <View style={styles.badgeRow}>
            <Ionicons name="car-sport-outline" size={20} color="#007AFF" />
            <Text style={styles.badgeText}>Servicio Automotriz Especializado</Text>
          </View>
          <Text style={styles.infoTitle}>Bienvenido a Perfect Shine</Text>
          <Text style={styles.infoText}>
            Revolucionamos el cuidado automotriz ofreciendo servicios de lavado premium con tecnología ecofriendly y productos de alta gama para preservar el valor de tu vehículo.
          </Text>
        </View>

        {/* 2. Sección Central: Carrusel */}
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="sparkles-outline" size={18} color="#007AFF" />
          <Text style={styles.sectionTitle}>Nuestros Trabajos y Resultados</Text>
        </View>

        <View style={styles.carouselContainer}>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + 15}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {BANNERS.map((banner) => (
              <View key={banner.id} style={[styles.bannerCard, { width: cardWidth }]}>
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
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Agendar un Servicio Ahora</Text>
        </TouchableOpacity>

        {/* 4. Pie de Página con Redes Sociales y Derechos Reservados */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Siguenos en nuestras redes</Text>
          
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
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  responsiveContent: {
    width: '100%',
    maxWidth: 850,
  },
  infoCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginTop: 15, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  infoTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a', 
    marginBottom: 8, 
  },
  infoText: { 
    color: '#475569', 
    fontSize: 14, 
    lineHeight: 22, 
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1e293b', 
    marginLeft: 6,
    textAlign: 'center', 
  },
  carouselContainer: { 
    height: 220, 
    marginBottom: 25, 
  },
  carouselContent: { 
    alignItems: 'center', 
  },
  bannerCard: { 
    height: 210, 
    borderRadius: 14, 
    overflow: 'hidden', 
    marginRight: 15, 
    backgroundColor: '#000',
    elevation: 3,
  },
  bannerImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover', 
  },
  bannerOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(15, 23, 42, 0.75)', 
    padding: 14, 
  },
  bannerText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
  actionButton: { 
    flexDirection: 'row',
    backgroundColor: '#007AFF', 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 25, 
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  footer: { 
    backgroundColor: '#0f172a', 
    padding: 24, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginBottom: 10, 
  },
  footerTitle: { 
    color: '#94a3b8', 
    fontSize: 13, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    marginBottom: 14, 
  },
  socialRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 12, 
    marginBottom: 16, 
  },
  socialChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 9, 
    borderRadius: 20, 
  },
  socialText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 13, 
  },
  copyright: { 
    color: '#64748b', 
    fontSize: 12, 
    textAlign: 'center', 
  },
});