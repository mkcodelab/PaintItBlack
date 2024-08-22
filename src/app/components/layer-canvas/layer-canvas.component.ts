import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'layer-canvas',
  templateUrl: './layer-canvas.component.html',
  styles: `
    .crosshair {
        cursor: crosshair;
    }
  `,
})
export class LayerCanvasComponent {
  @Input() width: number;
  @Input() height: number;

  @ViewChild('canvasElement') canvasElement: ElementRef;

  get context(): CanvasRenderingContext2D {
    return this.canvasElement.nativeElement.getContext('2d');
  }
}
