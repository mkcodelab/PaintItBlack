import { Component, inject } from '@angular/core';
import { Tool } from './tool';
import { CommonModule } from '@angular/common';
import { ToolboxService } from './toolbox.service';

@Component({
  standalone: true,
  selector: 'toolbox',
  templateUrl: './toolbox.component.html',
  imports: [CommonModule],
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
}
