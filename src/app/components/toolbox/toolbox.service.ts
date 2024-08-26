import { Injectable } from '@angular/core';
import { Tool, ToolType } from './tool';
import { BehaviorSubject, Subject } from 'rxjs';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export interface ToolboxData {
  _currentColor: Color;
  currentColor: Color;
  currentColorOpacity: number;
  lineWidth: number;
  rainbowEnabled: boolean;
  rainbowHueValue: number;
  spreadRadius: number;
  spreadDensity: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToolboxService {
  private _selectedTool: Tool | null = null;

  data: ToolboxData = {
    _currentColor: 'rgba(0,0,0,1)' as Color,
    currentColorOpacity: 1,
    lineWidth: 1,
    rainbowEnabled: false,
    rainbowHueValue: 0,
    spreadRadius: 1,
    spreadDensity: 1,
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
        const rgba = (values[0] +
          ',' +
          this.currentColorOpacity +
          ')') as Color;
        return rgba;
      } else {
        // normal color
        return this._currentColor;
      }
    },
  };

  private _tools: Tool[] = [
    new Tool('pencil', ToolType.PENCIL, { options: [] }),
    new Tool('spread', ToolType.SPREAD),
    new Tool('square', ToolType.SQUARE, { options: [] }),
    new Tool('fill', ToolType.FILL, { options: [] }),
    new Tool('ellipse', ToolType.ELLIPSE, { options: [] }),
    new Tool('eraser', ToolType.ERASER, { options: [] }),
  ];

  private lineWidthSubject$ = new BehaviorSubject<number>(this.data.lineWidth);
  public lineWidthChangeEvent$ = this.lineWidthSubject$.asObservable();

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
    this.data._currentColor = color;
  }

  toggleRainbow() {
    this.data.rainbowEnabled = !this.data.rainbowEnabled;
  }
  setLineWidth(value: string) {
    const numVal = Number(value);
    this.data.lineWidth = numVal;
    this.lineWidthSubject$.next(numVal);
  }
}
