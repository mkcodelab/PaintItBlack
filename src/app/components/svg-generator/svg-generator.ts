import { CTX } from '../canvas-box/canvas.service';

export function noise(ctx: CTX) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  //   svg.setAttribute('viewBox', '0 0 1000 600');
  svg.setAttribute('width', '1000');
  svg.setAttribute('height', '600');

  const turbulence = document.createElementNS(svgNS, 'feTurbulence');
  turbulence.setAttribute('baseFrequency', '0.01');
  turbulence.setAttribute('type', 'fractalNoise');

  // maybe it will be much faster and easier to just put inline svg inside component template?
}
