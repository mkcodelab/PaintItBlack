export class Layer {
  //   canvas: HTMLCanvasElement;
  uuid: string;
  context: CanvasRenderingContext2D;
  visible = true;
  constructor(public name: string) {
    this.uuid = crypto.randomUUID();
  }
}
