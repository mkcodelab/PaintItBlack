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

@Component({
  standalone: true,
  selector: 'layer-canvas',
  template: `
    <canvas
      class="crosshair"
      #canvasElement
      [width]="width"
      [height]="height"
    ></canvas>
  `,
  styles: `
    .crosshair {
        cursor: crosshair;
    }
  `,
})
export class LayerCanvasComponent implements AfterViewInit {
  @Input({ required: true }) width: number;
  @Input({ required: true }) height: number;
  @Input({ required: true }) layer: Layer;

  layersSvc = inject(LayersService);
  //   we need to dynamically create canvas element with context from layer object

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

// wstrzyknij tu layerService, potem w ngAfterViewInit wysylaj context do serwisu za pomocą metody
// injectContext(uuid, ctx) {
// layerToModify = this._layers.find( eleme => elem.uuid === uuid)
// layerToModify.context = ctx
// }
//
//
//
