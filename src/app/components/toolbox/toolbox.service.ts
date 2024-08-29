import { Injectable } from '@angular/core';
import { Tool, ToolType } from './tool';
import { BehaviorSubject } from 'rxjs';
import {
  drawCircles,
  drawLine,
  DrawParams,
  drawPoint,
  erase,
  erasePoint,
  fill,
} from '../canvas-box/drawing-functions';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type HSLA = `hsla(${number}, ${number}%, ${number}%, ${number})`;

export type Color = RGB | RGBA | HEX | HSLA;

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

// we need omitting some non numerical values for use in setDataAttribute method
export type ToolboxDataNumbers = Omit<
  ToolboxData,
  'currentColor' | '_currentColor' | 'rainbowEnabled'
>;

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
      if (this.rainbowEnabled) {
        this.rainbowHueValue += 0.1;
        return `hsl(${this.rainbowHueValue}, 100%, 50%)` as Color;
      } else {
        // normal color
        return this._currentColor;
      }
    },
  };

  //   fancy bug that is a feature, in "line tool" use drawLine for pointMethod, and probably no drawMethod
  private _tools: Tool[] = [
    new Tool('pencil', ToolType.PENCIL, {
      drawMethod: drawLine,
      pointMethod: drawPoint,
    }),
    new Tool('spread', ToolType.SPREAD, {
      drawMethod: drawCircles,
      pointMethod: drawCircles,
    }),
    new Tool('fill', ToolType.FILL, { drawMethod: fill, pointMethod: fill }),
    new Tool('eraser', ToolType.ERASER, {
      drawMethod: erase,
      pointMethod: erasePoint,
    }),
    // new Tool('ellipse', ToolType.ELLIPSE),
    // new Tool('square', ToolType.SQUARE),
  ];

  private dataSubject$ = new BehaviorSubject<ToolboxData>(this.data);
  public dataChangeEvent$ = this.dataSubject$.asObservable();

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

  setDataAttribute(attr: keyof ToolboxDataNumbers, value: string) {
    this.data[attr] = Number(value);
    this.dataSubject$.next(this.data);
  }
}
