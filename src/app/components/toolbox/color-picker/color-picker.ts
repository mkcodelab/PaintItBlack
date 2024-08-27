import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CTX } from '../../canvas-box/canvas.service';

@Component({
  standalone: true,
  selector: 'color-picker',
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
})
export class ColorPickerComponent implements AfterViewInit {
  @Output() colorChange = new EventEmitter();
  @Output() addToPalette = new EventEmitter();

  @ViewChild('hueCanvas') hueCanvasElement: ElementRef;

  ctx: CTX;

  color = {
    hue: 0,
    saturation: 100,
    light: 50,
    alpha: 1,
  };

  ngAfterViewInit() {
    const hueCanvas: HTMLCanvasElement = this.hueCanvasElement.nativeElement;
    const ctx = hueCanvas.getContext('2d');

    if (ctx) {
      this.ctx = ctx;
    }
  }

  drawColor(ctx: CTX, color: typeof this.color) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.fillStyle = this.getColorString(color);
    ctx.clearRect(0, 0, w, h);
    ctx.fillRect(0, 0, w, h);
  }

  getColorString(color: typeof this.color): string {
    return `hsla(${color.hue}, ${color.saturation}%, ${color.light}%, ${color.alpha})`;
  }

  setColorParameter(attribute: keyof typeof this.color, value: string) {
    this.color[attribute] = Number(value);
    this.drawColor(this.ctx, this.color);
    this.colorChange.emit(this.getColorString(this.color));
  }

  addColorToPalette() {
    // add them to the toolbox palette later
    this.addToPalette.emit(this.getColorString(this.color));
  }
}
