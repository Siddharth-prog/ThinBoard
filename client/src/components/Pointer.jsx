// Pointer.jsx
import React from 'react';

const Pointer = ({ x, y, tool, color, size }) => {
  const styles = {
    position: 'absolute',
    left: x,
    top: y,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 1000,
  };

  switch (tool) {
    case 'brush':
      return (
        <div style={styles}>
          <div
            style={{
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: color,
              border: '1px solid #000',
              opacity: 0.7,
            }}
          />
          <div style={{ 
            position: 'absolute',
            top: size + 5,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>
            Brush ({size}px)
          </div>
        </div>
      );
    case 'eraser':
      return (
        <div style={styles}>
          <div
            style={{
              width: size,
              height: size,
              backgroundColor: '#fff',
              border: '1px dashed #000',
              opacity: 0.7,
            }}
          />
          <div style={{ 
            position: 'absolute',
            top: size + 5,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>
            Eraser ({size}px)
          </div>
        </div>
      );
    case 'fill':
      return (
        <div style={styles}>
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path
              d="M12 2L15 8H9L12 2Z"
              fill={color}
              stroke="#000"
              strokeWidth="1"
            />
            <path
              d="M5 10V20H19V10H5Z"
              fill={color}
              stroke="#000"
              strokeWidth="1"
            />
          </svg>
          <div style={{ 
            position: 'absolute',
            top: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '2px 5px',
            borderRadius: '3px',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>
            Fill
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default Pointer;