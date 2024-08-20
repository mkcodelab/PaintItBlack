import { Component, inject } from '@angular/core';
import { LayersService } from './layers.service';

@Component({
  standalone: true,
  selector: 'layers',
  templateUrl: './layers.component.html',
})
export class LayersComponent {
  layersSvc = inject(LayersService);

  layers = this.layersSvc.layers;
}
