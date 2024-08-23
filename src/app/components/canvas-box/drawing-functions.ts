import { Color } from '../toolbox/toolbox.service';
import { MouseCoords } from './canvas-box.component';
import { CTX } from './canvas.service';

export function setLineProperties(ctx: CTX, lineWidth: number, color: Color) {
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
}
//   add posibility to draw dot on mouse click, not only on mousemove
export function drawLine(
  ctx: CTX,
  lineWidth: number,
  color: Color,
  prevCoords: MouseCoords,
  currentCoords: MouseCoords
) {
  setLineProperties(ctx, lineWidth, color);
  ctx.globalCompositeOperation = 'source-over';

  ctx.beginPath();
  ctx.moveTo(prevCoords.x, prevCoords.y);
  ctx.lineTo(currentCoords.x, currentCoords.y);
  ctx.stroke();
  ctx.closePath();
}

export function fill(ctx: CTX, color: Color) {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = color ?? '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
//   add posibility to draw dot on mouse click, not only on mousemove
export function drawCircles(
  ctx: CTX,
  lineWidth: number,
  color: Color,
  radius: number,
  mouseCoords: MouseCoords,
  density?: number
) {
  // add drawing circles functionality, randomized in a "radius" provided by lineThickness
  setLineProperties(ctx, lineWidth, color);

  //   we can manipulate density by putting this in forloop with density parameter
  const quantity = density ?? 1;
  for (let i = 0; i < quantity; i++) {
    // angle in degrees
    const angle = Math.random() * 360;
    const distanceFromCenter = Math.random() * radius;
    const x =
      mouseCoords.x + radius * Math.cos(degToRad(angle)) * distanceFromCenter;
    const y =
      mouseCoords.y + radius * Math.sin(degToRad(angle)) * distanceFromCenter;

    const pointSize = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
}

export function erase(
  ctx: CTX,
  lineWidth: number,
  color: Color,
  prevCoords: MouseCoords,
  currentCoords: MouseCoords
) {
  setLineProperties(ctx, lineWidth, color);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.moveTo(prevCoords.x, prevCoords.y);
  ctx.lineTo(currentCoords.x, currentCoords.y);
  ctx.stroke();
  ctx.closePath();
}

export function drawSquare() {}

function degToRad(angle: number) {
  return (angle * Math.PI) / 180;
}
