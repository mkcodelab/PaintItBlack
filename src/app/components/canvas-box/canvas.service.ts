import { inject, Injectable } from '@angular/core';
import { MouseCoords } from './canvas-box.component';
import { fromEvent, pairwise, switchMap, takeUntil } from 'rxjs';
import { ToolboxService } from '../toolbox/toolbox.service';

type CTX = CanvasRenderingContext2D;

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  // use it later with set and get, to change selected layer (context)
  context: CTX;

  toolboxSvc = inject(ToolboxService);

  //   for line drawing purposes
  prevCoords: MouseCoords;
  currentCoords: MouseCoords;

  changeContext(ctx: CTX) {
    this.context = ctx;
  }

  //   use this.context later on
  drawBackground(ctx: CTX) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
  // prevCoords: MouseCoords, currentCoords: MouseCoords
  drawLine(ctx: CTX) {
    // we have to have previous coords and current coords, and then use
    ctx.beginPath();
    ctx.moveTo(this.prevCoords.x, this.prevCoords.y);
    ctx.lineTo(this.currentCoords.x, this.currentCoords.y);
    ctx.stroke();
    ctx.closePath();
  }

  drawSquare() {}

  //   drawing line
  //   make it more universal
  public captureEvents(canvas: HTMLCanvasElement, ctx: CTX) {
    // const canvas = this.canvasElement.nativeElement;
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

        // this.mouseCoords = prevCoords;

        this.prevCoords = prevCoords;
        this.currentCoords = currentCoords;

        // if i.e pencil is selected
        if (this.toolboxSvc.selectedTool) {
          // some switch statement? move it to separate method
          if (this.toolboxSvc.selectedTool.name === 'line') this.drawLine(ctx);
        }
      });
  }
}
