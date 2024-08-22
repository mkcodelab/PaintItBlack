import { inject, Injectable } from '@angular/core';
import { MouseCoords } from './canvas-box.component';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';
import { ToolboxService } from '../toolbox/toolbox.service';
import { LayersService } from '../layers/layers.service';
import { Layer } from '../layers/layer';
import { ToolType } from '../toolbox/tool';

export type CTX = CanvasRenderingContext2D;

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  // use it later with set and get, to change selected layer (context)
  //   how to grab context from all layerCanvas canvas elements?
  //   just use context property from layer-canvas.component.ts
  private context: CTX;

  private toolboxSvc = inject(ToolboxService);
  private layersSvc = inject(LayersService);
  //   eventCanvasSvc = inject(EventCanvasService);

  //   for line drawing purposes
  private prevCoords: MouseCoords;
  private currentCoords: MouseCoords;

  changeContext(ctx: CTX) {
    this.context = ctx;
  }

  //   use this.context later on
  fill(ctx: CTX) {
    ctx.fillStyle = this.toolboxSvc.currentColor ?? '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  //   use this.context
  drawLine(ctx: CTX) {
    this.setLineProperties(ctx);
    ctx.globalCompositeOperation = 'source-over';

    ctx.beginPath();
    ctx.moveTo(this.prevCoords.x, this.prevCoords.y);
    ctx.lineTo(this.currentCoords.x, this.currentCoords.y);
    ctx.stroke();
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
  public captureEvents(canvas: HTMLElement, ctx: CTX) {
    fromEvent<MouseEvent>(canvas, 'mousedown')
      .pipe(
        switchMap(() => {
          return fromEvent(canvas, 'mousemove').pipe(
            takeUntil(fromEvent(canvas, 'mouseup')),
            takeUntil(fromEvent(canvas, 'mouseleave')),
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
  }
}
