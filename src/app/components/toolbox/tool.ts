import { DrawParams } from '../canvas-box/drawing-functions';

export interface ToolConfig {
  drawMethod?: Function;
  pointMethod?: Function;
}

export enum ToolType {
  PENCIL,
  ERASER,
  LINE,
  SQUARE,
  ELLIPSE,
  FILL,
  SPREAD,
}

export class Tool {
  constructor(
    public name: string,
    public toolType: ToolType,
    public toolConfig?: ToolConfig
  ) {}

  draw(drawParams: DrawParams) {
    if (this.toolConfig && this.toolConfig.drawMethod) {
      this.toolConfig.drawMethod(drawParams);
    } else {
      console.warn('config / draw method not specified');
    }
  }
  drawPointMethod(drawParams: DrawParams) {
    if (this.toolConfig && this.toolConfig.pointMethod) {
      this.toolConfig.pointMethod(drawParams);
    } else {
      console.warn('config / point method not specified');
    }
  }
}
