import { MouseCoords } from '../canvas-box/canvas-box.component';
import { CTX } from '../canvas-box/canvas.service';
import { DrawParams } from '../canvas-box/drawing-functions';
import { ToolboxData } from './toolbox.service';

export interface ToolConfig {
  //   options: ToolOptions[];
  drawMethod: Function;

  pointMethod?: Function;
}

export interface ToolOptions {}

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
    public toolConfig?: ToolConfig // public drawMethod?: () => {}
  ) {}

  //   figure out how to use this draw method for different tools
  draw(drawParams: DrawParams) {
    if (this.toolConfig) {
      // pass whole drawParams object into method
      this.toolConfig.drawMethod(drawParams);
    }
  }
  drawPointMethod(drawParams: DrawParams) {
    if (this.toolConfig && this.toolConfig.pointMethod) {
      this.toolConfig.pointMethod(drawParams);
    }
  }
}
