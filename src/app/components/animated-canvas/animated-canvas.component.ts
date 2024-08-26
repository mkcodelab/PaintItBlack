import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { BaseCanvasComponent } from '../base-canvas/base-canvas.component';
import { AnimatedCanvasService } from './animated-canvas.service';
import { NgStyle } from '@angular/common';

/**
 component for animating all helpers, for example brush size helper (graphical representation of it's size or other values)
 also animating visual representation of all "lines" or "squares", dynamic shapes etc.
 purely UX - infromational
*/
@Component({
  standalone: true,
  selector: 'animated-canvas',
  imports: [NgStyle],
  template: `
    <canvas
      #animatedCanvasElement
      [width]="width"
      [height]="height"
      [style]="cursorStyle"
    ></canvas>
  `,
})
export class AnimatedCanvasComponent extends BaseCanvasComponent {
  animatedCanvasSvc = inject(AnimatedCanvasService);
  cdr = inject(ChangeDetectorRef);

  @ViewChild('animatedCanvasElement') canvas: ElementRef<HTMLCanvasElement>;
  ngAfterViewInit() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (ctx) {
      //   create first image of cursor
      this.animatedCanvasSvc.renderCursor(2);

      //   then in init subscribe to the toolbox changeToolSizeEvent$ in animated-canvas.service for rendering with proper radius
      this.animatedCanvasSvc.init(ctx);

      //   for expressionChangedAfter...
      this.cdr.detectChanges();
    }
  }

  get cursorStyle() {
    return this.animatedCanvasSvc.cursorStyle;
  }
}
