import React from 'react';

function QRCode() {
  return (
    <div className="qr-code">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AB4M3" alt="QR Code" />
    </div>
  );
}

export default QRCode;
