import { Color, ToolboxData } from '../toolbox/toolbox.service';
import { MouseCoords } from './canvas-box.component';
import { CTX } from './canvas.service';

export function setLineProperties(
  // ctx: CTX, lineWidth: number, color: Color
  drawParams: DrawParams
) {
  const ctx = drawParams.context;
  ctx.lineWidth = drawParams.toolboxData.lineWidth;
  ctx.lineCap = 'round';
  ctx.strokeStyle = drawParams.toolboxData.currentColor;
  ctx.fillStyle = drawParams.toolboxData.currentColor;
}

// replace drawing functions all parameters with two parameters: context:CTX and drawParams: DrawParams
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

//   add posibility to draw dot on mouse click, not only on mousemove
export function drawPoint(
  //   ctx: CTX,
  //   toolboxData: ToolboxData,
  //   coords: MouseCoords,
  //   erase = false
  drawParams: DrawParams,
  erase = false
) {
  //   setLineProperties(ctx, lineWidth, color);

  //   setLineProperties(ctx, toolboxData.lineWidth, toolboxData.currentColor);
  //   drawCircle(ctx, coords, toolboxData.lineWidth, erase);
  setLineProperties(drawParams);
  drawCircle(
    drawParams.context,
    drawParams.currentCoords,
    drawParams.toolboxData.lineWidth,
    erase
  );
}

export function drawLine(
  //   ctx: CTX,

  //   toolboxData: ToolboxData,
  //   prevCoords: MouseCoords,
  //   currentCoords: MouseCoords
  drawParams: DrawParams,
  erase = false
) {
  //   setLineProperties(ctx, toolboxData.lineWidth, toolboxData.currentColor);
  //   ctx.globalCompositeOperation = 'source-over';

  //   ctx.beginPath();
  //   ctx.moveTo(prevCoords.x, prevCoords.y);
  //   ctx.lineTo(currentCoords.x, currentCoords.y);
  //   ctx.stroke();
  //   ctx.closePath();
  const ctx = drawParams.context;
  setLineProperties(drawParams);
  //   ctx.globalCompositeOperation = 'source-over';
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';

  ctx.beginPath();
  ctx.moveTo(drawParams.prevCoords.x, drawParams.prevCoords.y);
  ctx.lineTo(drawParams.currentCoords.x, drawParams.currentCoords.y);
  ctx.stroke();
  ctx.closePath();
}

export function fill(
  // ctx: CTX, color: Color
  drawParams: DrawParams
) {
  const ctx = drawParams.context;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = drawParams.toolboxData.currentColor ?? '#ffffff';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
//   add posibility to draw dot on mouse click, not only on mousemove
export function drawCircles(
  //   ctx: CTX,
  //   toolboxData: ToolboxData,
  //   mouseCoords: MouseCoords
  drawParams: DrawParams
) {
  const ctx = drawParams.context;

  // add drawing circles functionality, randomized in a "radius" provided by lineThickness
  //   setLineProperties(ctx, toolboxData.lineWidth, toolboxData.currentColor);

  //   //   we can manipulate density by putting this in forloop with density parameter
  //   const quantity = toolboxData.spreadDensity ?? 1;
  //   for (let i = 0; i < quantity; i++) {
  //     // angle in degrees
  //     const angle = Math.random() * 360;
  //     const distanceFromCenter = Math.random() * toolboxData.spreadRadius;
  //     const x = mouseCoords.x + Math.cos(degToRad(angle)) * distanceFromCenter;
  //     const y = mouseCoords.y + Math.sin(degToRad(angle)) * distanceFromCenter;

  //     const pointSize = toolboxData.lineWidth;

  //     drawCircle(ctx, { x, y }, pointSize);
  //   }
  setLineProperties(drawParams);

  //   we can manipulate density by putting this in forloop with density parameter
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

export function erase(
  //   ctx: CTX,
  //   toolboxData: ToolboxData,
  //   prevCoords: MouseCoords,
  //   currentCoords: MouseCoords
  drawParams: DrawParams
) {
  //   const ctx = drawParams.context;

  //   setLineProperties(drawParams);
  //   ctx.globalCompositeOperation = 'destination-out';
  //   ctx.beginPath();
  //   ctx.moveTo(drawParams.prevCoords.x, drawParams.prevCoords.y);
  //   ctx.lineTo(drawParams.currentCoords.x, drawParams.currentCoords.y);
  //   ctx.stroke();
  //   ctx.closePath();
  drawLine(drawParams, true);
}

export function erasePoint(drawParams: DrawParams) {
  drawPoint(drawParams, true);
}

export function drawSquare() {}

function degToRad(angle: number) {
  return (angle * Math.PI) / 180;
}
