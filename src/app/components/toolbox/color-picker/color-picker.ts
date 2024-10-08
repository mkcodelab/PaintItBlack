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
    saturation: 0,
    light: 0,
    alpha: 1,
  };

  ngAfterViewInit() {
    const hueCanvas: HTMLCanvasElement = this.hueCanvasElement.nativeElement;
    const ctx = hueCanvas.getContext('2d');

    if (ctx) {
      this.ctx = ctx;
      this.drawColor(this.ctx, this.color);
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
    this.addToPalette.emit(this.getColorString(this.color));
  }

  getInputBackgroundGradient(value: 'saturation' | 'light' | 'alpha'): string {
    const col = `hsl(${this.color.hue}, 100%, 50%)`;
    if (value === 'saturation') {
      return `linear-gradient(to right, #666, ${col})`;
    } else if (value === 'light') {
      return `linear-gradient(to right, #000, ${col}, #fff)`;
    } else {
      return `linear-gradient(to right, transparent, ${col})`;
    }
  }
}
