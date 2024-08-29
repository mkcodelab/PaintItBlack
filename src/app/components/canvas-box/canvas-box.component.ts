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
import { ProjectDataService } from '../../services/modal-service/project-data.service';

export interface MouseCoords {
  x: number;
  y: number;
}

@Component({
  standalone: true,
  selector: 'canvas-box',
  templateUrl: './canvas-box.component.html',
  imports: [LayerCanvasComponent, AnimatedCanvasComponent],
  styles: `
    .canvas-box-bg {
        background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% /
    40px 40px;
    }
  `,
})
export class CanvasBoxComponent implements AfterViewInit {
  private canvasSvc = inject(CanvasService);
  private projectDataSvc = inject(ProjectDataService);
  private layersSvc = inject(LayersService);

  private mouseCoords: MouseCoords;

  //   wrapper box around all canvas layers
  @ViewChild('layersWrapper') layersWrapper: ElementRef;

  ngAfterViewInit() {
    const layersWrapperElement = this.layersWrapper.nativeElement;

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
    return this.projectDataSvc.canvasSize;
  }
}
