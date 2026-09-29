import { Alert, Platform } from 'react-native';

/**
 * Muestra alertas compatibles de forma consistente en Web, Android e iOS.
 * En Web utiliza window.alert o window.confirm según los botones provistos.
 */
export const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    const formattedMessage = title ? `${title}\n\n${message || ''}` : (message || '');
    
    if (buttons && buttons.length > 1) {
      // Buscar botón de cancelación y botón de confirmación
      const cancelBtn = buttons.find(b => b.style === 'cancel');
      const actionBtn = buttons.find(b => b.style !== 'cancel') || buttons[0];
      
      const confirmed = typeof window !== 'undefined' ? window.confirm(formattedMessage) : true;
      if (confirmed) {
        if (actionBtn && typeof actionBtn.onPress === 'function') {
          actionBtn.onPress();
        }
      } else {
        if (cancelBtn && typeof cancelBtn.onPress === 'function') {
          cancelBtn.onPress();
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        window.alert(formattedMessage);
      }
      if (buttons && buttons[0] && typeof buttons[0].onPress === 'function') {
        buttons[0].onPress();
      }
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};
