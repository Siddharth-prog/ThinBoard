// Toolbar.jsx
import React from 'react';

const Toolbar = ({ selectedTool, setSelectedTool, setSelectedColor, brushSize, setBrushSize }) => {
  const buttonStyle = (tool) => ({
    padding: '8px 12px',
    marginRight: '5px',
    border: selectedTool === tool ? '2px solid #007bff' : '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: selectedTool === tool ? '#e7f1ff' : '#fff',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px'
  });

  return (
    <div style={{ 
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <button 
        onClick={() => setSelectedTool('brush')} 
        style={buttonStyle('brush')}
        title="Brush"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 2a10 10 0 0 0-7 17l5-5m7-7 1-6-6 1m2-2 4 4-5 5" />
        </svg>
        Brush
      </button>
      <button 
        onClick={() => setSelectedTool('eraser')} 
        style={buttonStyle('eraser')}
        title="Eraser"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M7 21h10M19 7l-4-4H9L5 7v10l4 4h6l4-4V7z" />
        </svg>
        Eraser
      </button>
      <button 
        onClick={() => setSelectedTool('fill')} 
        style={buttonStyle('fill')}
        title="Fill"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M19 11V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2m14 0v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6" />
        </svg>
        Fill
      </button>
      
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <label style={{ marginRight: '5px' }}>Color:</label>
        <input
          type="color"
          onChange={(e) => setSelectedColor(e.target.value)}
          style={{ width: '30px', height: '30px', cursor: 'pointer' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
        <label style={{ marginRight: '5px' }}>Size:</label>
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
          style={{ width: '100px' }}
        />
        <span style={{ marginLeft: '5px', width: '30px' }}>{brushSize}px</span>
      </div>
    </div>
  );
};

export default Toolbar;