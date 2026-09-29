import React, { useContext } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthProvider } from './AuthContext';
import { TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importación de pantallas
import InicioScreen from './screens/InicioScreen';
import ModelsScreen from './screens/ModelsScreen';
import MejorasScreen from './screens/MejorasScreen';
import InteriorScreen from './screens/InteriorScreen';
import PagoScreen from './screens/PagoScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import CitaScreen from './screens/CitaScreen';
import ReciboScreen from './screens/ReciboScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import LoginScreen from './screens/LoginScreen';
import SupportScreen from './screens/SupportScreen';
import MoreScreen from './screens/MoreScreen';
import MyCarScreen from './screens/MyCarScreen';
import LogoutScreen from './screens/LogoutScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator para el flujo de reserva y personalización del servicio
const CarCustomizationStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: true,
        headerStyle: { backgroundColor: '#ffffff', elevation: 1, shadowOpacity: 0.1 },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 17 },
      }}
    >
      <Stack.Screen name="Models" component={ModelsScreen} options={{ title: 'Selección de Vehículo' }} />
      <Stack.Screen name="Mejoras" component={MejorasScreen} options={{ title: 'Servicios y Paquetes' }} />
      <Stack.Screen name="Interior" component={InteriorScreen} options={{ title: 'Limpieza de Interior' }} />
      <Stack.Screen name="Cita" component={CitaScreen} options={{ title: 'Agendar Cita (Fecha y Hora)' }} />
      <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Agendar Cita Rápida' }} />
      <Stack.Screen name="Pago" component={PagoScreen} options={{ title: 'Método de Pago' }} />
      <Stack.Screen name="Recibo" component={ReciboScreen} options={{ title: 'Confirmación y Recibo' }} />
    </Stack.Navigator>
  );
};

// Drawer Navigator principal
const MainDrawer = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 1024;

  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#64748b',
        drawerLabelStyle: { fontWeight: '600', fontSize: 14, marginLeft: -10 },
        headerStyle: { backgroundColor: '#ffffff', elevation: 1, shadowOpacity: 0.08 },
        headerTintColor: '#0f172a',
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 16, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('Inicio')}
            activeOpacity={0.7}
          >
            <Image
              source={require('./assets/logo.png')}
              style={{ width: 38, height: 38, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen 
        name="Inicio" 
        component={InicioScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Servicios" 
        component={CarCustomizationStack} 
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="car-sport-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Soporte" 
        component={SupportScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="headset-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Más" 
        component={MoreScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal-circle-outline" size={size} color={color} />
          ),
        }}
      />
      
      {isLoggedIn && (
        <>
          <Drawer.Screen 
            name="Citas" 
            component={AppointmentsScreen} 
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="calendar-outline" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen 
            name="Mi Carro" 
            component={MyCarScreen} 
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="car-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}

      {isLoggedIn ? (
        <Drawer.Screen
          name="Salir"
          component={LogoutScreen}
          options={{ 
            unmountOnBlur: true,
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-out-outline" size={size} color={color} />
            ),
          }}
        />
      ) : (
        <Drawer.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            drawerIcon: ({ color, size }) => (
              <Ionicons name="log-in-outline" size={size} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainDrawer />
      </NavigationContainer>
    </AuthProvider>
  );
}