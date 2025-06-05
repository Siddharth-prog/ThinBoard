import React, { useRef, useEffect } from 'react';
import { floodFill } from '@/features/floodfill';

const Canvas = ({ selectedTool, selectedColor, brushSize, socket, roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

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

  const handleMouseUp = () => {
    drawing.current = false;
    if (ctxRef.current) ctxRef.current.beginPath();
  };

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default Canvas;
