import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { AuthContext } from '../AuthContext';
import { showAlert } from '../utils/platformAlert';

export default function AppointmentsScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  // Cargar citas desde Firestore
  const fetchAppointments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, 'citas'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((docSnap) => {
        list.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });

      // Ordenar por fecha descendente
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      setAppointments(list);
    } catch (error) {
      console.error('Error al obtener citas de Firestore:', error);
      showAlert('Error en Firestore', 'No se pudieron cargar tus citas: ' + (error.message || error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  // Cancelar una cita
  const handleCancelAppointment = (appointmentItem) => {
    showAlert(
      'Cancelar Cita',
      `¿Deseas cancelar tu cita para ${appointmentItem.vehicle || 'tu vehículo'} programada el ${appointmentItem.appointmentDate || appointmentItem.date}?`,
      [
        { text: 'No, mantener', style: 'cancel' },
        { 
          text: 'Sí, cancelar cita', 
          style: 'destructive',
          onPress: async () => {
            setCancelingId(appointmentItem.id);
            try {
              await updateDoc(doc(db, 'citas', appointmentItem.id), {
                status: 'Cancelada',
                canceledAt: new Date().toISOString(),
              });
              showAlert('Cita Cancelada', 'La cita ha sido marcada como cancelada.');
              fetchAppointments();
            } catch (err) {
              console.error('Error al cancelar cita:', err);
              showAlert('Error', 'No se pudo cancelar la cita: ' + err.message);
            } finally {
              setCancelingId(null);
            }
          }
        }
      ]
    );
  };

  // Ver recibo de una cita
  const handleViewReceipt = (item) => {
    navigation.navigate('Servicios', {
      screen: 'Recibo',
      params: {
        appointmentId: item.id,
        transactionId: item.transactionId || 'TX-' + item.id.slice(-6),
        service: item.service,
        vehicle: item.vehicle,
        price: item.price,
        date: item.appointmentDate || item.date,
        time: item.appointmentTime || item.time,
        cardHolder: item.cardHolder || user?.name || 'Cliente',
        lastFourDigits: item.lastFourDigits || '4242',
      }
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmada':
        return { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
      case 'Cancelada':
        return { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
      default:
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.responsiveWrapper}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.header}>Mis Citas Programadas</Text>
            <Text style={styles.subHeader}>Gestiona y consulta el historial de tus servicios en Firebase</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={fetchAppointments}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Consultando citas en Firestore...</Text>
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={60} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No tienes citas registradas</Text>
            <Text style={styles.emptyText}>
              Agenda tu primer servicio de lavado o detallado para tu vehículo.
            </Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => navigation.navigate('Servicios')}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.addButtonText}>Agendar Nueva Cita</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => {
              const badgeStyle = getStatusBadge(item.status);
              const isCanceled = item.status === 'Cancelada';

              return (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.service}>{item.service || 'Servicio de Lavado'}</Text>
                      <Text style={styles.vehicleText}>Vehículo: {item.vehicle || 'Sedán'}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                      <Text style={[styles.statusText, { color: badgeStyle.color }]}>
                        {item.status || 'Pendiente'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={16} color="#64748b" style={styles.infoIcon} />
                      <Text style={styles.details}>
                        {item.appointmentDate || item.date} a las {item.appointmentTime || item.time}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Ionicons name="pricetag-outline" size={16} color="#64748b" style={styles.infoIcon} />
                      <Text style={styles.details}>Monto: ${item.price} MXN</Text>
                    </View>

                    {item.transactionId && (
                      <View style={styles.infoRow}>
                        <Ionicons name="barcode-outline" size={16} color="#64748b" style={styles.infoIcon} />
                        <Text style={styles.details}>Folio: {item.id}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardActions}>
                    {/* Botón Ver Recibo si fue confirmada/pagada */}
                    {item.status === 'Confirmada' && (
                      <TouchableOpacity 
                        style={styles.actionBtnSecondary}
                        onPress={() => handleViewReceipt(item)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="receipt-outline" size={16} color="#007AFF" style={{ marginRight: 6 }} />
                        <Text style={styles.actionBtnSecondaryText}>Ver Comprobante</Text>
                      </TouchableOpacity>
                    )}

                    {/* Botón Cancelar si no está cancelada */}
                    {!isCanceled && (
                      <TouchableOpacity 
                        style={styles.cancelBtn}
                        onPress={() => handleCancelAppointment(item)}
                        disabled={cancelingId === item.id}
                        activeOpacity={0.8}
                      >
                        {cancelingId === item.id ? (
                          <ActivityIndicator size="small" color="#dc2626" />
                        ) : (
                          <>
                            <Ionicons name="close-circle-outline" size={16} color="#dc2626" style={{ marginRight: 6 }} />
                            <Text style={styles.cancelBtnText}>Cancelar Cita</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        {/* Botón flotante/inferior para agendar nueva cita */}
        {appointments.length > 0 && (
          <TouchableOpacity 
            style={styles.bottomAddButton}
            onPress={() => navigation.navigate('Servicios')}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addButtonText}>Agendar Otra Cita</Text>
          </TouchableOpacity>
        )}
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
    maxWidth: 800,
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  header: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#0f172a',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 13,
    color: '#64748b',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 320,
    lineHeight: 20,
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 18, 
    borderRadius: 14, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  service: { 
    fontSize: 17, 
    fontWeight: 'bold', 
    color: '#0f172a',
    marginBottom: 2,
  },
  vehicleText: {
    fontSize: 13,
    color: '#64748b',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: 'bold',
  },
  cardBody: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  infoIcon: {
    marginRight: 8,
  },
  details: { 
    fontSize: 13, 
    color: '#334155',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  actionBtnSecondaryText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  cancelBtnText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: 'bold',
  },
  addButton: { 
    flexDirection: 'row',
    backgroundColor: '#007AFF', 
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    borderRadius: 10, 
    alignItems: 'center', 
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  bottomAddButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 15,
  },
});