import {
  ElementRef,
  inject,
  Injectable,
  NgZone,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { CanvasService, CTX } from '../canvas-box/canvas.service';
import { MouseCoords } from '../canvas-box/canvas-box.component';
import { switchMap } from 'rxjs';
import { ToolboxData, ToolboxService } from '../toolbox/toolbox.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ToolType } from '../toolbox/tool';

@Injectable({
  providedIn: 'root',
})
export class AnimatedCanvasService {
  ngZone = inject(NgZone);
  canvasSvc = inject(CanvasService);
  toolboxSvc = inject(ToolboxService);

  raf: number;

  canvas: HTMLCanvasElement;
  context: CTX;

  cursorColor = '#00ff00';

  cursorStyle: string;

  mouseCoords: MouseCoords = { x: 0, y: 0 };

  //   for drawing rectangle
  box = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  loop() {
    this.raf = requestAnimationFrame(this.loop.bind(this));
    this.draw(this.context);
  }

  draw(ctx: CTX) {
    this.update();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#ff0000';
    // here put all drawing calls for diff tools
  }

  update() {}

  //   generating cursor image, not drawing it on canvas for minimal rendering latency.
  renderCursor(radius: number) {
    // canvas for render cursor image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const padding = 2;

    const width = (canvas.width = radius * 2 + padding);
    const height = (canvas.height = radius * 2 + padding);

    if (ctx) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.cursorColor;

      ctx.arc(canvas.width / 2, canvas.height / 2, radius / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    const url = canvas.toDataURL();
    this.cursorStyle = `cursor: url(${url}) ${width / 2} ${height / 2}, auto;`;
  }

  init(ctx: CTX) {
    this.context = ctx;
    this.canvas = ctx.canvas;

    // subscribe to canvasSvc mousePosition
    // probably we can do it more efficient / clearer with pipes...
    this.canvasSvc.mousePositionInitEvent$.subscribe(() => {
      this.canvasSvc.mousePosition$.subscribe((event: MouseEvent) => {
        const rect = this.canvas.getBoundingClientRect();

        this.mouseCoords = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      });
    });

    this.toolboxSvc.dataChangeEvent$.subscribe((data) => {
      switch (this.toolboxSvc.selectedTool?.toolType) {
        case ToolType.PENCIL:
          this.renderCursor(data.lineWidth);
          break;
        case ToolType.SPREAD:
          this.renderCursor(data.spreadRadius * 2);
          break;
        default:
          break;
      }
    });
    // do the same for spreadRadius
  }

  // animate only on demand, to counteract lagging behaviour
  //   animate only when certain tools are selected, for example square or ellipse
  startAnimation() {
    this.ngZone.runOutsideAngular(() => {
      this.loop();
    });
  }

  stopAnimation() {
    cancelAnimationFrame(this.raf);
  }
}
