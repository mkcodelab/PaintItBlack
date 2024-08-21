export class Layer {
  canvas: HTMLCanvasElement;
  uuid: number;
  constructor(public name: string) {
    this.canvas = document.createElement('canvas');
    this.uuid = Math.random() * 9;
  }
}
