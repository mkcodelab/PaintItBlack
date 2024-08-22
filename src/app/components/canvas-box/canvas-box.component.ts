import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { CanvasService } from './canvas.service';
import { LayerCanvasComponent } from '../layer-canvas/layer-canvas.component';

export interface MouseCoords {
  x: number;
  y: number;
}

@Component({
  standalone: true,
  selector: 'canvas-box',
  templateUrl: './canvas-box.component.html',
  imports: [LayerCanvasComponent],
})
export class CanvasBoxComponent implements AfterViewInit {
  canvasSvc = inject(CanvasService);
  //   eventCanvasSvc = inject(EventCanvasService);
  //   canvasRect: any;
  mouseCoords: MouseCoords;

  ctx: CanvasRenderingContext2D;

  //   later on use ViewChildren canvasElement to grab querylist of multiple canvas elements

  //   @ViewChild('canvasElement') canvasElement: ElementRef;
  @ViewChild('layerCanvas') layerCanvas: LayerCanvasComponent;

  //   @ViewChild('eventCanvas') eventCanvas: EventCanvasComponent;

  //   wrapper box around all canvas layers
  @ViewChild('layersWrapper') layersWrapper: ElementRef;

  ngAfterViewInit() {
    // const canvas = this.canvasElement.nativeElement;
    const canvas = this.layerCanvas.canvasElement.nativeElement;
    // const eventCanvas = this.eventCanvas.eventCanvas.nativeElement;

    const layersWrapperElement = this.layersWrapper.nativeElement;

    // this.ctx = canvas.getContext('2d');
    this.ctx = this.layerCanvas.context;

    if (this.ctx) {
      this.canvasSvc.drawBackground(this.ctx);
    }

    // this.canvasSvc.captureEvents(canvas, this.ctx);
    // getting events from layersWrapperElement
    this.canvasSvc.captureEvents(layersWrapperElement, this.ctx);

    // this.captureMousePosition(canvas);
    // get position on the layersWrapper element for universal position.
    this.captureMousePosition(layersWrapperElement);
  }

  get coordsString(): string {
    if (this.mouseCoords) {
      return (
        'x: ' +
        Math.floor(this.mouseCoords.x) +
        ' y: ' +
        Math.floor(this.mouseCoords.y)
      );
    } else {
      return '';
    }
  }

  //   move to event-canvas
  captureMousePosition(canvas: HTMLCanvasElement) {
    fromEvent<MouseEvent>(canvas, 'mousemove').subscribe(
      (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();

        this.mouseCoords = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
    );
  }
}
