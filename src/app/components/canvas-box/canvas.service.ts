import { inject, Injectable } from '@angular/core';
import { MouseCoords } from './canvas-box.component';
import {
  combineLatest,
  delay,
  fromEvent,
  map,
  merge,
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
import { LoggerService } from '../../services/logger.service';
import { ProjectDataService } from '../../services/project-data.service';
import { applyFilters } from './drawing-functions';
import { FiltersData } from '../filters/filters.component';

export type CTX = CanvasRenderingContext2D;

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private context: CTX;

  private toolboxSvc = inject(ToolboxService);
  private layersSvc = inject(LayersService);
  private loggerSvc = inject(LoggerService);
  private projectDataSvc = inject(ProjectDataService);

  //   for line drawing purposes
  private prevCoords: MouseCoords = { x: 0, y: 0 };
  private currentCoords: MouseCoords = { x: 0, y: 0 };

  //   used in animated-canvas.service
  private mousePositionInitSubject = new Subject();
  public mousePositionInitEvent$ = this.mousePositionInitSubject.asObservable();

  public mousePosition$: Observable<MouseEvent>;

  public pointerDown$: Observable<MouseEvent>;
  public pointerUp$: Observable<MouseEvent>;
  public pointerMove$: Observable<MouseEvent>;
  public pointerLeave$: Observable<MouseEvent>;

  private canvasRect: DOMRect;

  private windowResizeEvent$ = fromEvent(window, 'resize');

  changeContext(ctx: CTX) {
    this.context = ctx;
  }

  public captureLayerSwitchEvent() {
    this.layersSvc.activateLayerEvent$.subscribe((layer: Layer) => {
      this.changeContext(layer.context);
    });
  }

  public captureEvents(canvas: HTMLElement) {
    this.canvasRect = canvas.getBoundingClientRect();

    this.pointerDown$ = fromEvent<MouseEvent>(canvas, 'pointerdown');
    this.pointerUp$ = fromEvent<MouseEvent>(canvas, 'pointerup');
    this.pointerMove$ = fromEvent<MouseEvent>(canvas, 'pointermove');
    this.pointerLeave$ = fromEvent<MouseEvent>(canvas, 'pointerleave');

    this.mousePosition$ = fromEvent<MouseEvent>(canvas, 'mousemove');
    this.mousePositionInitSubject.next(true);

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

    //   dragging events for draggable tool type
    const dragStart$ = this.pointerDown$;

    const dragMove$ = dragStart$.pipe(
      switchMap(() => {
        return this.pointerMove$.pipe(takeUntil(this.pointerUp$));
      })
    );

    const dragEnd$ = this.pointerUp$;

    const dragEvents$ = combineLatest([dragStart$, dragMove$]);

    const allDragEvents = merge(dragEvents$, dragEnd$).subscribe((event) => {
      if (Array.isArray(event)) {
        // first element of array is dragStart, second is dragMove
        //   pass data to animation layer (to animate draggable tools like line, ellipse, rectangle, or even gradient indicator)
        // console.log(
        //   `dragstart: ${event[0].clientX}:${event[0].clientY} | dragMove: ${event[1].clientX}:${event[1].clientY} `
        // );
      } else {
        // console.log('dragEnd', event.clientX, event.clientY);
        // finalize events and draw from dragStart to dragEnd, pass dragStart this.prevCoords and dragEnd this.currentCoords
        // maybe it's better if we use separate variables for dragging, otherwise it would make conflict with other observables
        // this.dragStartCoords
        // this.dragEndCoords
        // this.drawWithCurrentTool('drag')
      }
    });

    //   recalculate bounding rect on resize
    this.windowResizeEvent$.subscribe(() => {
      this.canvasRect = canvas.getBoundingClientRect();
    });

    // must be delayed because getBoundingClientRect is not updated at the moment
    this.projectDataSvc.projectResizeEvent$.pipe(delay(200)).subscribe(() => {
      this.canvasRect = canvas.getBoundingClientRect();
    });

    this.pointerUp$.subscribe(() => {
      this.layersSvc.addActiveLayerOperation();
    });
  }

  //   add draggable here ?
  drawWithCurrentTool(type: 'point' | 'line' | 'drag') {
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
        } else if (type === 'point') {
          this.toolboxSvc.selectedTool.drawPointMethod(drawParams);
        } else {
          // this.toolboxSvc.selectedTool.dragMethod(drawParams)
          console.log('drawing with drag method');
        }
      } else {
        this.loggerSvc.warn('tool not selected');
      }
    } else {
      this.loggerSvc.warn('layer not selected');
    }
  }

  drawSvgImage(image: SVGImageElement) {
    if (this.context) {
      // convert imageElement to string
      const imageString = image.outerHTML;
      // convert to blob
      const svgBlob = new Blob([imageString], {
        type: 'image/svg+xml;charset=utf-8',
      });
      // create url from blob
      const url = URL.createObjectURL(svgBlob);
      // create image and add src attribute (url)
      const img = new Image();
      img.src = url;

      // when loaded
      img.addEventListener('load', () => {
        // draw image
        this.context.drawImage(
          img,
          0,
          0,
          this.context.canvas.width,
          this.context.canvas.height
        );
        // delete url from browser memory
        URL.revokeObjectURL(url);
      });
    } else {
      //   console.warn('no layer selected!');
      this.loggerSvc.warn('layer not selected!');
    }
  }

  applyFilters(filtersData: FiltersData) {
    if (this.context) {
      applyFilters(filtersData, this.context);
    } else {
      this.loggerSvc.warn('layer not selected!');
    }
  }
}
