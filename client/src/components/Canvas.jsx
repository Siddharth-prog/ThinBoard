import React, { useRef, useEffect, useState } from 'react';
import { floodFill } from '@/features/floodfill';

const Canvas = ({ selectedTool, selectedColor, brushSize, socket, roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const resizeCanvas = () => {
      const width = window.innerWidth * 0.75;
      const height = window.innerHeight - 100;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    const handleDrawing = (data) => {
      const ctx = ctxRef.current;
      const w = canvas.width;
      const h = canvas.height;

      if (data.type === 'brush' || data.type === 'eraser') {
        ctx.strokeStyle = data.type === 'eraser' ? '#ffffff' : data.color;
        ctx.lineWidth = data.size;
        ctx.beginPath();
        ctx.moveTo(data.x0 * w, data.y0 * h);
        ctx.lineTo(data.x1 * w, data.y1 * h);
        ctx.stroke();
      } else if (data.type === 'fill') {
        floodFill(ctx, data.x * w, data.y * h, data.color);
      }
    };

    socket.on('drawing', handleDrawing);

    return () => {
      socket.off('drawing', handleDrawing);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [socket]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const { x, y } = getPos(e);
    lastPos.current = { x, y };
    isDrawing.current = true;

    if (selectedTool === 'fill') {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      floodFill(ctx, x, y, selectedColor);
      socket.emit('drawing', {
        type: 'fill',
        x: x / canvas.width,
        y: y / canvas.height,
        color: selectedColor,
        roomId,
      });
      return;
    }

    setUndoStack((prev) => [...prev, canvasRef.current.toDataURL()]);
    setRedoStack([]);
  };

  const draw = (e) => {
    if (!isDrawing.current || selectedTool === 'fill') return;
    e.preventDefault();

    const { x, y } = getPos(e);
    const { x: lastX, y: lastY } = lastPos.current;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;

    ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : selectedColor;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    socket.emit('drawing', {
      type: selectedTool,
      x0: lastX / canvas.width,
      y0: lastY / canvas.height,
      x1: x / canvas.width,
      y1: y / canvas.height,
      color: selectedColor,
      size: brushSize,
      roomId,
    });

    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const restoreCanvas = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctxRef.current.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleTouchStart = (e) => startDrawing(e);
    const handleTouchMove = (e) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleUndo = () => {
    if (!undoStack.length) return;
    const last = undoStack.pop();
    setUndoStack([...undoStack]);
    setRedoStack((r) => [...r, canvasRef.current.toDataURL()]);
    restoreCanvas(last);
  };

  const handleRedo = () => {
    if (!redoStack.length) return;
    const next = redoStack.pop();
    setRedoStack([...redoStack]);
    setUndoStack((u) => [...u, canvasRef.current.toDataURL()]);
    restoreCanvas(next);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          display: 'block',
          touchAction: 'none',
          userSelect: 'none',
          backgroundColor: '#ffffff',
        }}
      />
      <div className="fixed bottom-4 left-4 flex gap-2">
        <button onClick={handleUndo} className="bg-gray-200 px-2 py-1 rounded">Undo</button>
        <button onClick={handleRedo} className="bg-gray-200 px-2 py-1 rounded">Redo</button>
      </div>
    </div>
  );
};

export default Canvas;
