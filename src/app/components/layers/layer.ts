export class Layer {
  uuid: string;
  context: CanvasRenderingContext2D;
  visible = true;
  operationsImageData: ImageData[] = [];

  currentOperationDataIndex = 0;

  constructor(public name: string) {
    this.uuid = crypto.randomUUID();
    // first data (empty ctx) after context injected
    setTimeout(() => {
      this.addOperation();
    }, 100);
  }
  // need to add empty imageData on init
  addOperation() {
    const imgData = this.context.getImageData(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.operationsImageData.push(imgData);
    // console.log(this.operationsImageData);
    // set index of last operation
    this.currentOperationDataIndex = this.operationsImageData.length - 1;
  }

  redo() {
    if (this.currentOperationDataIndex < this.operationsImageData.length) {
      this.currentOperationDataIndex++;
      this.repaint();
    }
  }

  undo() {
    if (this.currentOperationDataIndex > 0) {
      this.currentOperationDataIndex--;
      this.repaint();
    }
  }

  repaint() {
    const imgData = this.operationsImageData[this.currentOperationDataIndex];
    // console.log(imgData, this.currentOperationDataIndex);
    if (imgData) {
      this.context.putImageData(imgData, 0, 0);
    }
  }

  //   if we undo somehting, we should splice next data instead those
  // this.operationsImageData.splice(this.currentOperationDataIndex, 1, imgData)

  //   add setter for context and inside use side effect to fire callback "onContextInjected"
  // inside callback do all things we need for initialize context data
}
