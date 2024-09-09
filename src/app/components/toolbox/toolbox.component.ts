import { Component, inject } from '@angular/core';
import { Tool } from './tool';
import { Color, ToolboxDataNumbers, ToolboxService } from './toolbox.service';
import { ColorPaletteComponent } from '../color-pallete/color-palette.component';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'toolbox',
  templateUrl: './toolbox.component.html',
  imports: [ColorPaletteComponent, NgClass],
  styleUrl: './toolbox.scss',
})
export class Toolbox {
  toolboxSvc = inject(ToolboxService);

  public tools = this.toolboxSvc.tools;

  onToolSelect(tool: Tool) {
    this.toolboxSvc.selectTool(tool);
  }

  isToolSelected(tool: Tool): boolean {
    return this.toolboxSvc.selectedTool === tool;
  }

  changeColor(colorValue: string) {
    const color = colorValue as Color;
    this.toolboxSvc.data._currentColor = color;
  }

  setDataAttribute(attr: keyof ToolboxDataNumbers, value: string) {
    this.toolboxSvc.setDataAttribute(attr, value);
  }

  getPercentOpacity(value: string) {
    return Math.floor(Number(value) * 100);
  }
}
