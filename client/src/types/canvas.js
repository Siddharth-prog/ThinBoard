
export const LayerType = {
  Rectangle: 0,
  Ellipse: 1,
  Path: 2,
  Text: 3,
  Image: 4,
};

export const Side = {
  Top: 1,
  Bottom: 2,
  Left: 4,
  Right: 8,
};

export const CanvasMode = {
  None: 0,
  SelectionNet: 1,
  Translating: 2,
  Inserting: 3,
  Pencil: 4,
  Pressing: 5,
  Resizing: 6,
};

export function Color(r, g, b) {
  return { r, g, b };
}

export function Camera(x, y) {
  return { x, y };
}

export function RectangleLayer(x, y, width, height, fill, value) {
  return {
    type: LayerType.Rectangle,
    x,
    y,
    width,
    height,
    fill,
    value,
  };
}

export function EllipseLayer(x, y, width, height, fill, value) {
  return {
    type: LayerType.Ellipse,
    x,
    y,
    width,
    height,
    fill,
    value,
  };
}

export function PathLayer(x, y, width, height, fill, points, value) {
  return {
    type: LayerType.Path,
    x,
    y,
    width,
    height,
    fill,
    points,
    value,
  };
}

export function TextLayer(x, y, width, height, fill, value) {
  return {
    type: LayerType.Text,
    x,
    y,
    width,
    height,
    fill,
    value,
  };
}

export function ImageLayer(x, y, width, height,src) {
  return {
    type: LayerType.Image,
    x,
    y,
    width,
    height,
    src,
  };
}

export function Point(x, y) {
  return { x, y };
}

export function XYWH(x, y, width, height) {
  return { x, y, width, height };
}

export function CanvasStateNone() {
  return { mode: CanvasMode.None };
}

export function CanvasStateSelectionNet(origin, current) {
  return { mode: CanvasMode.SelectionNet, origin, current };
}

export function CanvasStateTranslating(current) {
  return { mode: CanvasMode.Translating, current };
}

export function CanvasStateInserting(layerType) {
  return { mode: CanvasMode.Inserting, layerType };
}

export function CanvasStatePencil() {
  return { mode: CanvasMode.Pencil };
}

export function CanvasStatePressing(origin) {
  return { mode: CanvasMode.Pressing, origin };
}

export function CanvasStateResizing(initialBounds, corner) {
  return { mode: CanvasMode.Resizing, initialBounds, corner };
}
