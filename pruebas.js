const QRCode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const fs = require('fs');

// URL que quieres convertir a código QR
const url = 'https://www.jostens.com/';

// Generar el código QR y guardarlo como una imagen
QRCode.toFile(
  'codigo_qr.png',
  url,
  {
    color: {
      dark: '#000000', // Color del QR
      light: '#ffffff', // Color de fondo
    },
  },
  (err) => {
    if (err) throw err;
    console.log('Código QR generado y guardado como codigo_qr.png');
  }
);

// Mostrar el código QR en la terminal
qrcodeTerminal.generate(url, { small: true }, (qrcode) => {
  console.log('Código QR en la terminal:\n');
  console.log(qrcode);
});
