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
import { LayersService } from '../layers/layers.service';

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
  private canvasSvc = inject(CanvasService);
  private layersSvc = inject(LayersService);

  private mouseCoords: MouseCoords;

  private ctx: CanvasRenderingContext2D;

  //   later on use ViewChildren canvasElement to grab querylist of multiple canvas elements
  //   getting first layerCanvas element (for now used only for drawing white background on first layer)
  @ViewChild('layerCanvas') layerCanvas: LayerCanvasComponent;

  //   wrapper box around all canvas layers
  @ViewChild('layersWrapper') layersWrapper: ElementRef;

  ngAfterViewInit() {
    this.ctx = this.layerCanvas.context;

    const layersWrapperElement = this.layersWrapper.nativeElement;

    if (this.ctx) {
      this.canvasSvc.fill(this.ctx);
    }

    // getting events from layersWrapperElement
    this.canvasSvc.captureEvents(layersWrapperElement);
    this.canvasSvc.captureLayerSwitchEvent();

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

  get layers() {
    return this.layersSvc.layers;
  }

  get canvasSize() {
    return this.canvasSvc.canvasSize;
  }

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
