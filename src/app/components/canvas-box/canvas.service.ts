import { inject, Injectable } from '@angular/core';
import { MouseCoords } from './canvas-box.component';
import {
  fromEvent,
  interval,
  Observable,
  pairwise,
  repeat,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ToolboxService } from '../toolbox/toolbox.service';
import { LayersService } from '../layers/layers.service';
import { Tool, ToolType } from '../toolbox/tool';
import {
  drawCircles,
  drawLine,
  drawPoint,
  erase,
  fill,
} from './drawing-functions';

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

  //   temporary, for initial background color
  fill(ctx: CTX) {
    fill(ctx, this.toolboxSvc.currentColor);
  }

  public captureLayerSwitchEvent() {
    this.layersSvc.activateLayerEvent$.subscribe((layer: any) => {
      this.changeContext(layer.context);
    });
  }

  //   drawing line
  //   make it more universal
  //   we need to add more event captures
  public captureEvents(canvas: HTMLElement) {
    // event for point drawing
    // use switchMap to map to new observable, i.e interval and takeuntil pointerup
    // fromEvent<MouseEvent>(canvas, 'pointerdown')
    //   .pipe(tap(console.log))
    //   .subscribe((ev) => {
    //     const rect = canvas.getBoundingClientRect();
    //     const mouseCoords = {
    //       x: ev.clientX - rect.left,
    //       y: ev.clientY - rect.top,
    //     };
    //     this.currentCoords = mouseCoords;

    //     this.drawPointCurrentTool();

    //     // teardown logic is necessary on pointerup
    //     // setInterval(() => {
    //     //   this.drawPointCurrentTool();
    //     // }, 0);
    //   });

    fromEvent<MouseEvent>(canvas, 'pointerdown')
      .pipe(
        switchMap((ev) => {
          return new Observable<any>((subscriber) => {
            const interval = setInterval(() => {
              subscriber.next(ev);
            }, 0);

            return () => {
              clearInterval(interval);
            };
          }).pipe(
            takeUntil(fromEvent(canvas, 'pointerup')),
            takeUntil(fromEvent(canvas, 'pointermove'))
          );
        })
      )
      .subscribe((ev) => {
        const rect = canvas.getBoundingClientRect();
        const mouseCoords = {
          x: ev.clientX - rect.left,
          y: ev.clientY - rect.top,
        };
        this.currentCoords = mouseCoords;

        this.drawPointCurrentTool();
      });

    fromEvent<MouseEvent>(canvas, 'pointerdown')
      .pipe(
        switchMap(() => {
          return fromEvent(canvas, 'pointermove').pipe(
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
  //   responsible for drawing points / etc without mousemove, on just a pointerdown event
  drawPointCurrentTool() {
    const color = this.toolboxSvc.currentColor;
    const lineWidth = this.toolboxSvc.lineWidth;
    const radius = this.toolboxSvc.spreadRadius;
    // add switch statement for pencil and spread

    if (this.context && this.toolboxSvc.selectedTool) {
      switch (this.toolboxSvc.selectedTool.toolType) {
        case ToolType.PENCIL:
          drawPoint(this.context, lineWidth, color, this.currentCoords);

          break;
        case ToolType.ERASER:
          drawPoint(this.context, lineWidth, color, this.currentCoords, true);
          break;
        case ToolType.SPREAD:
          drawCircles(
            this.context,
            lineWidth,
            color,
            radius,
            this.currentCoords
          );
          break;
        default:
          break;
      }
    }
  }

  drawWithCurrentTool() {
    // all those values came from toolboxService, so we can just pass toolboxService.data object to those drawing functions for
    // simplicity
    const color = this.toolboxSvc.currentColor;
    const lineWidth = this.toolboxSvc.lineWidth;
    const radius = this.toolboxSvc.spreadRadius;

    if (this.context) {
      if (this.toolboxSvc.selectedTool) {
        switch (this.toolboxSvc.selectedTool.toolType) {
          case ToolType.PENCIL:
            drawLine(
              this.context,
              lineWidth,
              color,
              this.prevCoords,
              this.currentCoords
            );
            break;
          case ToolType.ERASER:
            erase(
              this.context,
              lineWidth,
              color,
              this.prevCoords,
              this.currentCoords
            );
            break;
          case ToolType.FILL:
            // works if we click and move around (should be fired in outer observable (before switchmap))
            // maybe we should separate those events for later use in different tools
            // this.fill(this.context);
            fill(this.context, color);
            break;
          case ToolType.SPREAD:
            drawCircles(
              this.context,
              lineWidth,
              color,
              radius,
              this.prevCoords,
              this.toolboxSvc.spreadDensity
            );
            break;
          default:
            break;
        }
      }
    } else {
      console.warn('layer not selected');
    }
  }
}
