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
import { ProjectDataService } from '../../services/project-data.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { CursorLayerComponent } from '../cursor-layer/cursor-layer.component';

export interface MouseCoords {
  x: number;
  y: number;
}

@Component({
  standalone: true,
  selector: 'canvas-box',
  templateUrl: './canvas-box.component.html',
  imports: [
    LayerCanvasComponent,
    AnimatedCanvasComponent,
    CursorLayerComponent,
    AsyncPipe,
    JsonPipe,
  ],
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

  //   private mouseCoords: MouseCoords;
  public mouseCoords$: Observable<string>;

  //   wrapper box around all canvas layers
  @ViewChild('layersWrapper') layersWrapper: ElementRef;

  ngAfterViewInit() {
    const layersWrapperElement = this.layersWrapper.nativeElement;

    // initialize observable with layersWrapper element (needs to be initialized before subscription ofc)
    // getting events from layersWrapperElement
    this.canvasSvc.captureEvents(layersWrapperElement);
    this.canvasSvc.captureLayerSwitchEvent();

    // move to cursor-layer.component along with template output
    this.mouseCoords$ = this.canvasSvc.mousePosition$.pipe(
      map((ev: MouseEvent) => {
        const rect = layersWrapperElement.getBoundingClientRect();
        const x = Math.floor(ev.clientX - rect.left);
        const y = Math.floor(ev.clientY - rect.top);
        return `x: ${x}, y: ${y}`;
      })
    );
  }

  get layers() {
    return this.layersSvc.layers;
  }

  get canvasSize() {
    return this.projectDataSvc.canvasSize;
  }
}
