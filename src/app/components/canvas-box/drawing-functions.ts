import { ToolboxData } from '../toolbox/toolbox.service';
import { MouseCoords } from './canvas-box.component';
import { CTX } from './canvas.service';

export function setLineProperties(drawParams: DrawParams) {
  const ctx = drawParams.context;
  ctx.lineWidth = drawParams.toolboxData.lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = drawParams.toolboxData.currentColor;
  ctx.fillStyle = drawParams.toolboxData.currentColor;
}

export interface DrawParams {
  context: CTX;
  toolboxData: ToolboxData;
  prevCoords: MouseCoords;
  currentCoords: MouseCoords;
  erase?: boolean;
}

// helper function for drawing circles
function drawCircle(
  ctx: CTX,
  coords: MouseCoords,
  lineWidth: number,
  erase = false
) {
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
  ctx.beginPath();
  ctx.arc(coords.x, coords.y, lineWidth / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
}

export function drawPoint(drawParams: DrawParams, erase = false) {
  setLineProperties(drawParams);
  drawCircle(
    drawParams.context,
    drawParams.currentCoords,
    drawParams.toolboxData.lineWidth,
    erase
  );
}

export function drawLine(drawParams: DrawParams, erase = false) {
  const ctx = drawParams.context;
  setLineProperties(drawParams);
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';

  ctx.beginPath();
  ctx.moveTo(drawParams.prevCoords.x, drawParams.prevCoords.y);
  ctx.lineTo(drawParams.currentCoords.x, drawParams.currentCoords.y);
  ctx.stroke();
  ctx.closePath();
}

export function fill(drawParams: DrawParams) {
  const ctx = drawParams.context;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = drawParams.toolboxData.currentColor ?? '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
export function drawCircles(drawParams: DrawParams) {
  const ctx = drawParams.context;

  setLineProperties(drawParams);

  const quantity = drawParams.toolboxData.spreadDensity ?? 1;
  for (let i = 0; i < quantity; i++) {
    // angle in degrees
    const angle = Math.random() * 360;
    const distanceFromCenter =
      Math.random() * drawParams.toolboxData.spreadRadius;
    const x =
      drawParams.currentCoords.x +
      Math.cos(degToRad(angle)) * distanceFromCenter;
    const y =
      drawParams.currentCoords.y +
      Math.sin(degToRad(angle)) * distanceFromCenter;

    const pointSize = drawParams.toolboxData.lineWidth;

    drawCircle(ctx, { x, y }, pointSize);
  }
}

export function erase(drawParams: DrawParams) {
  drawLine(drawParams, true);
}

export function erasePoint(drawParams: DrawParams) {
  drawPoint(drawParams, true);
}

export function drawSquare() {}

function degToRad(angle: number) {
  return (angle * Math.PI) / 180;
}
