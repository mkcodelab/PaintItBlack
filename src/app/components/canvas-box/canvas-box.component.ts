import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { CanvasService } from './canvas.service';
import { LayerCanvasComponent } from '../layer-canvas/layer-canvas.component';
import { LayersService } from '../layers/layers.service';
import { AnimatedCanvasComponent } from '../animated-canvas/animated-canvas.component';

export interface MouseCoords {
  x: number;
  y: number;
}

@Component({
  standalone: true,
  selector: 'canvas-box',
  templateUrl: './canvas-box.component.html',
  imports: [LayerCanvasComponent, AnimatedCanvasComponent],
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

    // initialize observable with layersWrapper element (needs to be initialized before subscription ofc)
    this.canvasSvc.initMousePositionObservable(layersWrapperElement);
    this.canvasSvc.mousePosition$.subscribe((event: MouseEvent) => {
      const rect = layersWrapperElement.getBoundingClientRect();

      this.mouseCoords = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    });
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
      return 'x: 0 y: 0';
    }
  }

  get layers() {
    return this.layersSvc.layers;
  }

  get canvasSize() {
    return this.canvasSvc.canvasSize;
  }
}
