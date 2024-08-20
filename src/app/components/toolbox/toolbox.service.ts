import { Injectable } from '@angular/core';
import { Tool } from './tool';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

@Injectable({
  providedIn: 'root',
})
export class ToolboxService {
  private _selectedTool: Tool | undefined = undefined;

  private _currentColor: Color;
  private _lineWidth: number;

  private _tools: Tool[] = [
    new Tool('line', 'lineIcon', { options: [] }),
    new Tool('square', 'squareIcon', { options: [] }),
    new Tool('fill', 'fillIcon', { options: [] }),
    new Tool('ellipse', 'ellipseIcon', { options: [] }),
    new Tool('eraser', 'eraser', { options: [] }),
  ];

  selectTool(tool: Tool) {
    this._selectedTool = tool;
  }

  //   isToolSelected(tool: Tool): boolean {
  //     return this.selectedTool === tool;
  //   }

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
    return this._currentColor;
  }

  set lineWidth(lineWidth: number) {
    this._lineWidth = lineWidth;
  }
  get lineWidth() {
    return this._lineWidth;
  }
}
