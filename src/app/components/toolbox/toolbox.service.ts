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
  // `rgb(${255},${255},${255})`
  private _currentColor: Color;
  currentColorOpacity = 1;
  private _lineWidth: number;

  private _tools: Tool[] = [
    new Tool('pencil', ToolType.PENCIL, { options: [] }),
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

  set lineWidth(lineWidth: number) {
    this._lineWidth = lineWidth;
  }
  get lineWidth() {
    return this._lineWidth;
  }
}
