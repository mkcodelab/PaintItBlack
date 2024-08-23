import { inject, Injectable } from '@angular/core';
import { MouseCoords } from './canvas-box.component';
import { fromEvent, pairwise, switchMap, takeUntil, tap } from 'rxjs';
import { ToolboxService } from '../toolbox/toolbox.service';
import { LayersService } from '../layers/layers.service';
import { Layer } from '../layers/layer';
import { ToolType } from '../toolbox/tool';

export type CTX = CanvasRenderingContext2D;

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  public canvasSize = {
    width: 1000,
    height: 600,
  };

  private context: CTX;

  private toolboxSvc = inject(ToolboxService);
  private layersSvc = inject(LayersService);

  //   for line drawing purposes
  private prevCoords: MouseCoords;
  private currentCoords: MouseCoords;

  changeContext(ctx: CTX) {
    this.context = ctx;
  }

  fill(ctx: CTX) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = this.toolboxSvc.currentColor ?? '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  //   add posibility to draw dot on mouse click, not only on mousemove
  drawLine(ctx: CTX) {
    this.setLineProperties(ctx);
    ctx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    ctx.moveTo(this.prevCoords.x, this.prevCoords.y);
    ctx.lineTo(this.currentCoords.x, this.currentCoords.y);
    ctx.stroke();
    ctx.closePath();
  }

  //   do it more properly
  drawCircles(ctx: CTX, mouseCoords: MouseCoords) {
    // add drawing circles functionality, randomized in a "radius" provided by lineThickness
    this.setLineProperties(ctx);

    const radius = this.toolboxSvc.spreadRadius;
    // console.log(center.x, center.y);

    // angle in degrees
    const angle = Math.random() * 360;
    const distanceFromCenter = Math.random() * radius;
    const x =
      mouseCoords.x +
      radius * Math.cos((-angle * Math.PI) / 180) * distanceFromCenter;
    const y =
      mouseCoords.y +
      radius * Math.sin((-angle * Math.PI) / 180) * distanceFromCenter;

    const pointSize = this.toolboxSvc.lineWidth;
    // console.log('spread', x, y);
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  erase(ctx: CTX) {
    this.setLineProperties(ctx);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(this.prevCoords.x, this.prevCoords.y);
    ctx.lineTo(this.currentCoords.x, this.currentCoords.y);
    ctx.stroke();
    ctx.closePath();
  }

  drawSquare() {}

  public captureLayerSwitchEvent() {
    this.layersSvc.activateLayerEvent$.subscribe((layer: any) => {
      this.changeContext(layer.context);
    });
  }

  //   drawing line
  //   make it more universal
  // instead of passing ctx use this.context property (it will be switched by switching layers later)
  public captureEvents(canvas: HTMLElement) {
    fromEvent<MouseEvent>(canvas, 'pointerdown')
      .pipe(
        switchMap(() => {
          return fromEvent(canvas, 'pointermove').pipe(
            // tap(console.log),
            takeUntil(fromEvent(canvas, 'pointerup')),
            takeUntil(fromEvent(canvas, 'pointerleave')),
            pairwise()
          );
        })
      )
      .subscribe((res: [any, any]) => {
        const rect = canvas.getBoundingClientRect();
        const prevCoords = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };
        const currentCoords = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };

        this.prevCoords = prevCoords;
        this.currentCoords = currentCoords;

        this.drawWithCurrentTool();
      });
  }

  drawWithCurrentTool() {
    if (this.context) {
      if (this.toolboxSvc.selectedTool) {
        switch (this.toolboxSvc.selectedTool.toolType) {
          case ToolType.PENCIL:
            this.drawLine(this.context);
            break;
          case ToolType.ERASER:
            this.erase(this.context);
            break;
          case ToolType.FILL:
            // works if we click and move around (should be fired in outer observable (before switchmap))
            // maybe we should separate those events for later use in different tools
            this.fill(this.context);
            break;
          case ToolType.SPREAD:
            this.drawCircles(this.context, this.prevCoords);
            break;
          default:
            break;
        }
      }
    } else {
      console.warn('layer not selected');
    }
  }

  setLineProperties(ctx: CTX) {
    ctx.lineWidth = this.toolboxSvc.lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.toolboxSvc.currentColor;
    ctx.fillStyle = this.toolboxSvc.currentColor;
  }
}
