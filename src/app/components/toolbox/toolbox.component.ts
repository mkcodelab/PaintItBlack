import { Component, inject } from '@angular/core';
import { Tool } from './tool';
import { Color, ToolboxService } from './toolbox.service';
import { ColorPaletteComponent } from '../color-pallete/color-palette.component';

@Component({
  standalone: true,
  selector: 'toolbox',
  templateUrl: './toolbox.component.html',
  imports: [ColorPaletteComponent],
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
    this.toolboxSvc.lineWidth = Number(value);
  }

  changeColor(colorValue: string) {
    const color = colorValue as Color;
    this.toolboxSvc.currentColor = color;
  }
}
