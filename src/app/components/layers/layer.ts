export class Layer {
  canvas: HTMLCanvasElement;
  uuid: number;
  context: CanvasRenderingContext2D;
  constructor(public name: string) {
    this.uuid = Math.random() * 9;
  }
}
