import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext, AuthProvider } from './AuthContext';
import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Importación de pantallas basadas en tu estructura de archivos
import InicioScreen from './screens/InicioScreen';
import ModelsScreen from './screens/ModelsScreen';
import MejorasScreen from './screens/MejorasScreen';
import InteriorScreen from './screens/InteriorScreen';
import PagoScreen from './screens/PagoScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import CitaScreen from './screens/CitaScreen'; // <-- NUEVA PANTALLA AGREGADA
import ReciboScreen from './screens/ReciboScreen';
import AppointmentsScreen from './screens/AppointmentsScreen';
import LoginScreen from './screens/LoginScreen';
import SupportScreen from './screens/SupportScreen';
import MoreScreen from './screens/MoreScreen';
import MyCarScreen from './screens/MyCarScreen';
import LogoutScreen from './screens/LogoutScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack Navigator para el flujo de reserva / personalización del servicio
const CarCustomizationStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Models" component={ModelsScreen} options={{ title: 'Modelos' }} />
      <Stack.Screen name="Mejoras" component={MejorasScreen} options={{ title: 'Servicios y Mejoras' }} />
      <Stack.Screen name="Interior" component={InteriorScreen} options={{ title: 'Limpieza de Interior' }} />
      {/* Agregamos CitaScreen para el calendario y horarios */}
      <Stack.Screen name="Cita" component={CitaScreen} options={{ title: 'Agendar Cita (Calendario)' }} />
      <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Agendar Cita' }} />
      <Stack.Screen name="Pago" component={PagoScreen} options={{ title: 'Método de Pago' }} />
      <Stack.Screen name="Recibo" component={ReciboScreen} options={{ title: 'Confirmación / Recibo' }} />
    </Stack.Navigator>
  );
};

// Drawer Navigator principal
const MainDrawer = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => navigation.navigate('Inicio')}
          >
            <Image
              source={require('./assets/logo.png')}
              style={{ width: 40, height: 40, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen name="Inicio" component={InicioScreen} />
      <Drawer.Screen name="Servicios" component={CarCustomizationStack} />
      <Drawer.Screen name="Soporte" component={SupportScreen} />
      <Drawer.Screen name="Más" component={MoreScreen} />
      
      {isLoggedIn && (
        <>
          <Drawer.Screen name="Citas" component={AppointmentsScreen} />
          <Drawer.Screen name="Mi Carro" component={MyCarScreen} />
        </>
      )}

      {isLoggedIn ? (
        <Drawer.Screen
          name="Salir"
          component={LogoutScreen}
          options={{ unmountOnBlur: true }}
        />
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
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