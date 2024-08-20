export class Layer {
  canvas: HTMLCanvasElement;
  constructor(public name: string, public index: number) {
    this.canvas = new HTMLCanvasElement();
  }
}
