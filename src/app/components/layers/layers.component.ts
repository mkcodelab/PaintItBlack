import { Component, inject } from '@angular/core';
import { LayersService } from './layers.service';
import { Layer } from './layer';
import { MovableListComponent } from '../movable-list/movable-list.component';
import { LoggerService } from '../../services/logger.service';

@Component({
  standalone: true,
  selector: 'layers',
  templateUrl: './layers.component.html',
  imports: [MovableListComponent],
})
export class LayersComponent {
  layersSvc = inject(LayersService);
  loggerSvc = inject(LoggerService);

  layers = this.layersSvc.layers;

  addLayerMenuOpen = false;

  addLayer(name: string) {
    if (name) {
      this.layersSvc.createLayer(name);
      this.addLayerMenuOpen = false;
    } else {
      this.loggerSvc.error('Please insert name');
    }
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

  openAddLayer() {
    this.addLayerMenuOpen = true;
  }
}
