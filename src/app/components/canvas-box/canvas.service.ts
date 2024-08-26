import { inject, Injectable } from '@angular/core';
import { MouseCoords } from './canvas-box.component';
import {
  fromEvent,
  map,
  Observable,
  pairwise,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ToolboxService } from '../toolbox/toolbox.service';
import { LayersService } from '../layers/layers.service';
import { ToolType } from '../toolbox/tool';
import {
  drawCircles,
  drawLine,
  drawPoint,
  erase,
  fill,
} from './drawing-functions';
import { Layer } from '../layers/layer';

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

  private mousePositionInitSubject = new Subject();
  public mousePositionInitEvent$ = this.mousePositionInitSubject.asObservable();

  public mousePosition$: Observable<MouseEvent>;

  public pointerDown$: Observable<MouseEvent>;
  public pointerUp$: Observable<MouseEvent>;
  public pointerMove$: Observable<MouseEvent>;
  public pointerLeave$: Observable<MouseEvent>;

  changeContext(ctx: CTX) {
    this.context = ctx;
  }

  //   temporary, for initial background color
  fill(ctx: CTX) {
    fill(ctx, this.toolboxSvc.currentColor);
  }

  public captureLayerSwitchEvent() {
    this.layersSvc.activateLayerEvent$.subscribe((layer: Layer) => {
      this.changeContext(layer.context);
    });
  }

  initMousePositionObservable(eventHandlingElement: HTMLElement) {
    this.mousePosition$ = fromEvent<MouseEvent>(
      eventHandlingElement,
      'mousemove'
    );
    this.mousePositionInitSubject.next(true);
  }

  public captureEvents(canvas: HTMLElement) {
    const rect = canvas.getBoundingClientRect();

    this.pointerDown$ = fromEvent<MouseEvent>(canvas, 'pointerdown');
    this.pointerUp$ = fromEvent<MouseEvent>(canvas, 'pointerup');
    this.pointerMove$ = fromEvent<MouseEvent>(canvas, 'pointermove');
    this.pointerLeave$ = fromEvent<MouseEvent>(canvas, 'pointerleave');
    // event for point drawing

    // mouse hold event (only in place)
    this.pointerDown$
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
            takeUntil(this.pointerUp$),
            takeUntil(this.pointerMove$),
            map((event) => {
              return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              };
            })
          );
        })
      )
      .subscribe((coords: MouseCoords) => {
        this.currentCoords = coords;
        this.drawPointCurrentTool();
      });

    //   pointerdown > pointermove event, for drawing lines
    this.pointerDown$
      .pipe(
        switchMap(() => {
          return this.pointerMove$.pipe(
            takeUntil(this.pointerUp$),
            takeUntil(this.pointerLeave$),
            map((event) => {
              return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              };
            }),

            pairwise()
          );
        })
      )
      .subscribe((coords: [MouseCoords, MouseCoords]) => {
        this.prevCoords = coords[0];
        this.currentCoords = coords[1];
        this.drawWithCurrentTool();
      });
  }

  //   responsible for drawing points / etc without mousemove, on just a pointerdown event
  drawPointCurrentTool() {
    if (this.context && this.toolboxSvc.selectedTool) {
      switch (this.toolboxSvc.selectedTool.toolType) {
        case ToolType.PENCIL:
          drawPoint(this.context, this.toolboxSvc.data, this.currentCoords);

          break;
        case ToolType.ERASER:
          drawPoint(
            this.context,
            this.toolboxSvc.data,
            this.currentCoords,
            true
          );
          break;
        case ToolType.SPREAD:
          drawCircles(this.context, this.toolboxSvc.data, this.currentCoords);
          break;
        case ToolType.FILL:
          fill(this.context, this.toolboxSvc.data.currentColor);
          break;
        default:
          break;
      }
    }
  }

  drawWithCurrentTool() {
    if (this.context) {
      if (this.toolboxSvc.selectedTool) {
        switch (this.toolboxSvc.selectedTool.toolType) {
          case ToolType.PENCIL:
            drawLine(
              this.context,
              this.toolboxSvc.data,
              this.prevCoords,
              this.currentCoords
            );
            break;

          case ToolType.ERASER:
            erase(
              this.context,
              this.toolboxSvc.data,
              this.prevCoords,
              this.currentCoords
            );
            break;

          case ToolType.SPREAD:
            drawCircles(this.context, this.toolboxSvc.data, this.prevCoords);
            break;

          default:
            break;
        }
      } else {
        console.warn('tool not selected');
      }
    } else {
      console.warn('layer not selected');
    }
  }
}
