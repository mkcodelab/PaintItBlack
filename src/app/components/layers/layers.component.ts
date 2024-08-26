import { Component, inject } from '@angular/core';
import { LayersService } from './layers.service';
import { Layer } from './layer';
import { MovableListComponent } from '../movable-list/movable-list.component';

@Component({
  standalone: true,
  selector: 'layers',
  templateUrl: './layers.component.html',
  imports: [MovableListComponent],
})
export class LayersComponent {
  layersSvc = inject(LayersService);

  layers = this.layersSvc.layers;

  addLayer(name: string) {
    this.layersSvc.createLayer(name);
  }

  onMoveDownEvent(layer: Layer) {
    this.layersSvc.moveLayerDown(layer);
  }
  onMoveUpEvent(layer: Layer) {
    this.layersSvc.moveLayerUp(layer);
  }

  onActivateLayer(layer: Layer) {
    this.layersSvc.activateLayer(layer);
  }

  onRemoveLayer(layer: Layer) {
    this.layersSvc.removeLayer(layer);
  }

  onToggleLayer(layer: Layer) {
    this.layersSvc.toggleLayer(layer);
  }

  get activeLayer() {
    return this.layersSvc.activeLayer;
  }
}
