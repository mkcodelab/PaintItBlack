import { Component, inject } from '@angular/core';
import { Color, ToolboxService } from '../toolbox/toolbox.service';

@Component({
  standalone: true,
  selector: 'color-palette',
  templateUrl: './color-palette.component.html',
})
export class ColorPaletteComponent {
  toolboxSvc = inject(ToolboxService);

  predefinedColors: Color[] = [
    '#000000',
    '#FABFAB',
    '#CCFFCC',
    '#221188',
    '#32F91C',
  ];

  changeColor(colorValue: string) {
    const color = colorValue as Color;
    this.toolboxSvc.currentColor = color;
  }
}
