import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { Layer } from '../layers/layer';
import { LayersService } from '../layers/layers.service';
import { BaseCanvasComponent } from '../base-canvas/base-canvas.component';
/**
 * layer with canvas element where drawing calls are executed
 */
@Component({
  standalone: true,
  selector: 'layer-canvas',
  template: `
    <canvas #canvasElement [width]="width" [height]="height"></canvas>
  `,
})
export class LayerCanvasComponent
  extends BaseCanvasComponent
  implements AfterViewInit
{
  @Input({ required: true }) layer: Layer;

  layersSvc = inject(LayersService);

  @ViewChild('canvasElement') canvasElement: ElementRef;

  get context(): CanvasRenderingContext2D {
    return this.canvasElement.nativeElement.getContext('2d');
  }

  ngAfterViewInit() {
    this.layersSvc.injectContext(
      this.layer.uuid,
      this.canvasElement.nativeElement.getContext('2d')
    );
  }
}
