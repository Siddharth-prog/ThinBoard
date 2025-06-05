// client/src/components/Export.jsx
import React from 'react';

function Export() {
  const handleExport = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-1 rounded">Export</button>
  );
}

export default Export;
