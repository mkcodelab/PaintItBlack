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
import { Layer } from '../layers/layer';

export type CTX = CanvasRenderingContext2D;

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private context: CTX;

  private toolboxSvc = inject(ToolboxService);
  private layersSvc = inject(LayersService);

  //   for line drawing purposes
  private prevCoords: MouseCoords = { x: 0, y: 0 };
  private currentCoords: MouseCoords = { x: 0, y: 0 };

  private mousePositionInitSubject = new Subject();
  public mousePositionInitEvent$ = this.mousePositionInitSubject.asObservable();

  public mousePosition$: Observable<MouseEvent>;

  public pointerDown$: Observable<MouseEvent>;
  public pointerUp$: Observable<MouseEvent>;
  public pointerMove$: Observable<MouseEvent>;
  public pointerLeave$: Observable<MouseEvent>;

  private canvasRect: DOMRect;

  private resizeEvent$ = fromEvent(window, 'resize');

  changeContext(ctx: CTX) {
    this.context = ctx;
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
    this.canvasRect = canvas.getBoundingClientRect();

    this.pointerDown$ = fromEvent<MouseEvent>(canvas, 'pointerdown');
    this.pointerUp$ = fromEvent<MouseEvent>(canvas, 'pointerup');
    this.pointerMove$ = fromEvent<MouseEvent>(canvas, 'pointermove');
    this.pointerLeave$ = fromEvent<MouseEvent>(canvas, 'pointerleave');

    // event for point drawing

    // mouse hold event (only in place)
    this.pointerDown$
      .pipe(
        // delay(100),
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
                x: event.clientX - this.canvasRect.left,
                y: event.clientY - this.canvasRect.top,
              };
            })
          );
        })
      )
      .subscribe((coords: MouseCoords) => {
        this.currentCoords = coords;

        this.drawWithCurrentTool('point');
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
                x: event.clientX - this.canvasRect.left,
                y: event.clientY - this.canvasRect.top,
              };
            }),

            pairwise()
          );
        })
      )
      .subscribe((coords: [MouseCoords, MouseCoords]) => {
        this.prevCoords = coords[0];
        this.currentCoords = coords[1];
        this.drawWithCurrentTool('line');
      });

    //   recalculate bounding rect on resize
    this.resizeEvent$.subscribe(
      () => (this.canvasRect = canvas.getBoundingClientRect())
    );
  }

  drawWithCurrentTool(type: 'point' | 'line') {
    const drawParams = {
      context: this.context,
      toolboxData: this.toolboxSvc.data,
      prevCoords: this.prevCoords,
      currentCoords: this.currentCoords,
    };

    if (this.context) {
      if (this.toolboxSvc.selectedTool) {
        if (type === 'line') {
          this.toolboxSvc.selectedTool.draw(drawParams);
        } else {
          this.toolboxSvc.selectedTool.drawPointMethod(drawParams);
        }
      } else {
        console.warn('tool not selected');
      }
    } else {
      console.warn('layer not selected');
    }
  }
}
