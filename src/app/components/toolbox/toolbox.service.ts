import { Injectable } from '@angular/core';
import { Tool, ToolType } from './tool';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

@Injectable({
  providedIn: 'root',
})
export class ToolboxService {
  private _selectedTool: Tool | undefined = undefined;
  //   maybe we should agregate those variables in some object like toolValues
  private _currentColor: Color;
  currentColorOpacity = 1;
  private _lineWidth = 1;

  rainbowHueValue = 0;

  rainbowEnabled = false;

  //   move to spread tool toolConfig
  spreadRadius = 1;
  spreadDensity = 1;

  private _tools: Tool[] = [
    new Tool('pencil', ToolType.PENCIL, { options: [] }),
    new Tool('spread', ToolType.SPREAD),
    new Tool('square', ToolType.SQUARE, { options: [] }),
    new Tool('fill', ToolType.FILL, { options: [] }),
    new Tool('ellipse', ToolType.ELLIPSE, { options: [] }),
    new Tool('eraser', ToolType.ERASER, { options: [] }),
  ];

  selectTool(tool: Tool) {
    this._selectedTool = tool;
  }

  get selectedTool() {
    return this._selectedTool;
  }

  get tools() {
    return this._tools;
  }

  set currentColor(color: Color) {
    this._currentColor = color;
  }

  get currentColor() {
    // just create proper rgba object and store data there!
    // temp solution
    if (this.rainbowEnabled) {
      this.rainbowHueValue += 0.1;
      return `hsl(${this.rainbowHueValue}, 100%, 50%)` as Color;
    }
    let values;
    if (this._currentColor) {
      values = this._currentColor.split(')');
      const rgba = (values[0] + ',' + this.currentColorOpacity + ')') as Color;
      return rgba;
    } else {
      // normal color
      return this._currentColor;
    }
  }

  toggleRainbow() {
    this.rainbowEnabled = !this.rainbowEnabled;
  }

  set lineWidth(lineWidth: number) {
    this._lineWidth = lineWidth;
  }
  get lineWidth() {
    return this._lineWidth;
  }
}
