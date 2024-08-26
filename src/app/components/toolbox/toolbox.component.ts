import { Component, inject } from '@angular/core';
import { Tool } from './tool';
import { Color, ToolboxService } from './toolbox.service';
import { ColorPaletteComponent } from '../color-pallete/color-palette.component';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'toolbox',
  templateUrl: './toolbox.component.html',
  imports: [ColorPaletteComponent, NgClass],
  styles: `
    .tool {
        background: rgba(255,255,255, 0.2);
        transition: filter 0.3s ease, background-color 0.3s ease, border 0.3s ease;

        &:hover {
            filter: contrast(150%);
            background: rgba(100, 255, 100, 0.2)
        }
    }
    .selected {
        background: rgba(100,255,100,0.2)
    }
  `,
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

  setLineWidth(value: string) {
    this.toolboxSvc.setLineWidth(value);
  }

  changeColor(colorValue: string) {
    const color = colorValue as Color;
    this.toolboxSvc.data._currentColor = color;
  }

  setOpacity(opacityValue: string) {
    this.toolboxSvc.data.currentColorOpacity = Number(opacityValue);
  }

  setSpread(spreadRadiusValue: string) {
    this.toolboxSvc.data.spreadRadius = Number(spreadRadiusValue);
  }

  setSpreadDensity(densityValue: string) {
    this.toolboxSvc.data.spreadDensity = Number(densityValue);
  }

  getPercentOpacity(value: string) {
    return Math.floor(Number(value) * 100);
  }
}
