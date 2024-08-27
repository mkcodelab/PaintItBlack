import { Component, inject } from '@angular/core';
import { Color, ToolboxService } from '../toolbox/toolbox.service';
import { ColorPickerComponent } from '../toolbox/color-picker/color-picker';

@Component({
  standalone: true,
  selector: 'color-palette',
  templateUrl: './color-palette.component.html',
  imports: [ColorPickerComponent],
  styles: `
    .rainbow-button {
        background-image: linear-gradient(to right, red, orange, yellow, lime, green, blue, purple)
    }
  `,
})
export class ColorPaletteComponent {
  toolboxSvc = inject(ToolboxService);

  customPalette: Color[] = [];

  predefinedColors: Color[] = [
    // '#000000',
    // '#FABFAB',
    // '#CCFFCC',
    // '#221188',
    // '#32F91C',
  ];

  generateRandomColorPalette(): Color[] {
    const palette: Color[] = [];
    for (let i = 0; i < 20; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);

      const color = `rgb(${r},${g},${b})` as Color;
      palette.push(color);
    }
    return palette;
  }

  generateColors() {
    this.predefinedColors = this.generateRandomColorPalette();
  }

  changeColor(colorValue: string) {
    const color = colorValue as Color;
    this.toolboxSvc.currentColor = color;
  }

  toggleRainbow() {
    this.toolboxSvc.toggleRainbow();
  }

  get isRainbowEnabled() {
    return this.toolboxSvc.data.rainbowEnabled;
  }

  onColorChange(color: Color) {
    this.toolboxSvc.currentColor = color;
  }

  onAddToPalette(color: Color) {
    this.customPalette.push(color);
  }
}
