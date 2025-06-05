export function floodFill(ctx, x, y, fillColor) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const data = imageData.data;
  
    const targetColor = getColorAt(data, x, y, canvasWidth);
    const newColor = hexToRgba(fillColor);
  
    if (colorsMatch(targetColor, newColor)) return;
  
    const stack = [[x, y]];
    if (isNaN(x) || isNaN(y)) return;

    while (stack.length) {
    if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;

      const [currX, currY] = stack.pop();
      const idx = (currY * canvasWidth + currX) * 4;
  
      const current = getColorAt(data, currX, currY, canvasWidth);
      if (!colorsMatch(current, targetColor)) continue;
  
      setColorAt(data, currX, currY, canvasWidth, newColor);
  
      if (currX > 0) stack.push([currX - 1, currY]);
      if (currX < canvasWidth - 1) stack.push([currX + 1, currY]);
      if (currY > 0) stack.push([currX, currY - 1]);
      if (currY < canvasHeight - 1) stack.push([currX, currY + 1]);
    }
  
    ctx.putImageData(imageData, 0, 0);
  }
  
  function getColorAt(data, x, y, width) {
    const i = (y * width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  }
  
  function setColorAt(data, x, y, width, [r, g, b, a]) {
    const i = (y * width + x) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
  
  function colorsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  }
  
  function hexToRgba(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255,
      255,
    ];
  }
  