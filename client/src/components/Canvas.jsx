import React, { useRef, useEffect, useState } from 'react';
import { floodFill } from '@/features/floodfill';

const Canvas = ({ selectedTool, selectedColor, brushSize, socket, roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.75;
    canvas.height = window.innerHeight - 100;
    canvas.style.border = '1px solid #000';
    canvas.style.backgroundColor = '#fff';

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    const handleDrawing = (data) => {
      if (!ctxRef.current) return;
      const ctx = ctxRef.current;

      if (data.type === 'brush') {
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.size;
        ctx.beginPath();
        ctx.moveTo(data.x0, data.y0);
        ctx.lineTo(data.x1, data.y1);
        ctx.stroke();
      } else if (data.type === 'eraser') {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = data.size;
        ctx.beginPath();
        ctx.moveTo(data.x0, data.y0);
        ctx.lineTo(data.x1, data.y1);
        ctx.stroke();
      } else if (data.type === 'fill') {
        floodFill(ctx, data.x, data.y, data.color);
      }
    };

    socket.on('drawing', handleDrawing);
    return () => socket.off('drawing', handleDrawing);
  }, [socket]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };
  // ⬇️ Restore image from Data URL
  const restoreCanvas = (dataUrl) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
  };
  const handleMouseDown = (e) => {
    const { x, y } = getMousePos(e);
    if (!ctxRef.current || isNaN(x) || isNaN(y)) return;
    drawing.current = true;

    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lastX = x;
    ctx.lastY = y;

    if (selectedTool === 'fill') {
      floodFill(ctx, Math.floor(x), Math.floor(y), selectedColor);
      socket.emit('drawing', {
        type: 'fill',
        x: Math.floor(x),
        y: Math.floor(y),
        color: selectedColor,
        roomId,
      });
      drawing.current = false;
    }
    const canvas = canvasRef.current;
    const snapshot = canvas.toDataURL();
    setUndoStack((prev) => [...prev, snapshot]);
    setRedoStack([]); // clear redo stack
  };

  const handleMouseMove = (e) => {
    if (!drawing.current) return;
    const { x, y } = getMousePos(e);
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (selectedTool === 'brush' || selectedTool === 'eraser') {
      const color = selectedTool === 'eraser' ? '#ffffff' : selectedColor;

      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineTo(x, y);
      ctx.stroke();

      socket.emit('drawing', {
        type: selectedTool,
        x0: ctx.lastX,
        y0: ctx.lastY,
        x1: x,
        y1: y,
        color: selectedColor,
        size: brushSize,
        roomId,
      });

      ctx.lastX = x;
      ctx.lastY = y;
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((prevStack) => prevStack.slice(0, -1));
    setRedoStack((r) => [...r, canvasRef.current.toDataURL()]);
    restoreCanvas(prev);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setUndoStack((u) => [...u, canvasRef.current.toDataURL()]);
    restoreCanvas(next);
  };

  const handleMouseUp = () => {
    drawing.current = false;
    if (ctxRef.current) ctxRef.current.beginPath();
  };

  return (
    <div>
    <canvas
      id="canvas"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
    <div className="fixed bottom-4 left-4 flex gap-2">
        <button onClick={handleUndo} className="bg-gray-200 px-2 py-1 rounded">Undo</button>
        <button onClick={handleRedo} className="bg-gray-200 px-2 py-1 rounded">Redo</button>
      </div>
    </div>
  );
};

export default Canvas;
