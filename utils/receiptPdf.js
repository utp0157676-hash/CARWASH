import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { showAlert } from './platformAlert';

/**
 * Genera el HTML estructurado del comprobante de servicio CarWash
 */
export const buildReceiptHtml = ({
  clientName = 'Cliente',
  vehicle = 'Sedán',
  service = 'Lavado General',
  date = '2026-09-10',
  time = '10:00 AM',
  price = 250,
  transactionId = 'TX-' + Date.now(),
  appointmentId = 'PENDIENTE',
  lastFourDigits = '4242',
}) => {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprobante de Servicio - Perfect Shine CarWash</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 30px;
      color: #1e293b;
      background-color: #ffffff;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #007AFF;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .brand-title {
      color: #007AFF;
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 6px 0;
      letter-spacing: 1px;
    }
    .brand-sub {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 13px;
      margin-top: 15px;
      border: 1px solid #a7f3d0;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .details-table td {
      padding: 12px 8px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 14px;
    }
    .label {
      color: #64748b;
      font-weight: 600;
      width: 40%;
    }
    .value {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
    }
    .total-box {
      margin-top: 25px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #e2e8f0;
    }
    .total-label {
      font-size: 16px;
      font-weight: 700;
      color: #334155;
    }
    .total-amount {
      font-size: 22px;
      font-weight: 800;
      color: #10b981;
    }
    .footer {
      margin-top: 35px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="brand-title">PERFECT SHINE CARWASH</h1>
      <p class="brand-sub">Comprobante Oficial de Reserva y Pago</p>
      <div class="badge">PAGO CONFIRMADO Y REGISTRADO</div>
    </div>

    <table class="details-table">
      <tr>
        <td class="label">Folio / Cita ID:</td>
        <td class="value">${appointmentId}</td>
      </tr>
      <tr>
        <td class="label">No. Transacción:</td>
        <td class="value">${transactionId}</td>
      </tr>
      <tr>
        <td class="label">Titular de Cuenta:</td>
        <td class="value">${clientName}</td>
      </tr>
      <tr>
        <td class="label">Vehículo:</td>
        <td class="value">${vehicle}</td>
      </tr>
      <tr>
        <td class="label">Servicio Contratado:</td>
        <td class="value">${service}</td>
      </tr>
      <tr>
        <td class="label">Fecha Programada:</td>
        <td class="value">${date}</td>
      </tr>
      <tr>
        <td class="label">Horario:</td>
        <td class="value">${time}</td>
      </tr>
      <tr>
        <td class="label">Método de Pago:</td>
        <td class="value">Tarjeta (**** ${lastFourDigits})</td>
      </tr>
      <tr>
        <td class="label">Estado de Cita:</td>
        <td class="value" style="color: #10b981;">Confirmada</td>
      </tr>
    </table>

    <div class="total-box">
      <span class="total-label">Total Pagado:</span>
      <span class="total-amount">$${price} MXN</span>
    </div>

    <div class="footer">
      <p><strong>Gracias por elegir Perfect Shine CarWash</strong></p>
      <p>Presenta este comprobante digital o impreso al momento de entregar tu vehiculo.</p>
      <p>Av. Principal #123, Col. Centro, San Pablo del Monte / Puebla | Tel: (222) 123-4567</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Genera, imprime o descarga el comprobante en Web, Android e iOS
 */
export const generateAndShareReceipt = async (receiptData) => {
  const htmlContent = buildReceiptHtml(receiptData);

  try {
    if (Platform.OS === 'web') {
      // Intento 1: expo-print en web (abre diálogo nativo de impresión/guardar PDF)
      if (Print && typeof Print.printAsync === 'function') {
        try {
          await Print.printAsync({ html: htmlContent });
          return true;
        } catch (printErr) {
          console.warn('Print.printAsync en web fallo, usando fallback de navegador:', printErr);
        }
      }

      // Fallback directo en Web: abrir ventana e imprimir
      if (typeof window !== 'undefined') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 300);
          return true;
        }
      }

      showAlert('Comprobante', 'Tu comprobante esta listo. Por favor verifica las ventanas emergentes del navegador.');
      return true;
    }

    // Android / iOS
    const result = await Print.printToFileAsync({ html: htmlContent });
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable && result && result.uri) {
      await Sharing.shareAsync(result.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Comprobante de Reserva - Perfect Shine',
      });
    } else {
      showAlert(
        'Comprobante Guardado',
        'El archivo PDF del comprobante fue generado exitosamente en tu dispositivo.'
      );
    }
    return true;
  } catch (error) {
    console.error('Error al generar o compartir el comprobante:', error);
    showAlert('Error', 'No se pudo generar el comprobante PDF: ' + (error.message || error));
    return false;
  }
};
