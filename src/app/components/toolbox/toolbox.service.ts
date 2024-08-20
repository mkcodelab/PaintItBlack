import { Injectable } from '@angular/core';
import { Tool } from './tool';

@Injectable({
  providedIn: 'root',
})
export class ToolboxService {
  private _selectedTool: Tool | undefined = undefined;

  public currentColor: string;
  public lineWidth: number;

  private _tools: Tool[] = [
    new Tool('line', 'lineIcon', { options: [] }),
    new Tool('square', 'squareIcon', { options: [] }),
    new Tool('fill', 'fillIcon', { options: [] }),
    new Tool('ellipse', 'ellipseIcon', { options: [] }),
    new Tool('eraser', 'eraser', { options: [] }),
  ];

  selectTool(tool: Tool) {
    console.log('selected tool service: ', tool);
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
}
