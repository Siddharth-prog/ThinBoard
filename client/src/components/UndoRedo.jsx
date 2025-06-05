// client/src/components/UndoRedo.jsx
import React from 'react';

function UndoRedo() {
  const handleUndo = () => {
    const undoBtn = document.querySelector('button[onClick*="undo"]');
    if (undoBtn) undoBtn.click();
  };

  const handleRedo = () => {
    const redoBtn = document.querySelector('button[onClick*="redo"]');
    if (redoBtn) redoBtn.click();
  };

  return (
    <div className="flex gap-2 mt-2 ml-4">
      <button onClick={handleUndo} className="px-3 py-1 bg-gray-400 text-white rounded">
        Undo
      </button>
      <button onClick={handleRedo} className="px-3 py-1 bg-gray-400 text-white rounded">
        Redo
      </button>
    </div>
  );
}

export default UndoRedo;
