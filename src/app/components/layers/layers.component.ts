import { Component, inject } from '@angular/core';
import { LayersService, LayerListEventData } from './layers.service';
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

  get activeLayer() {
    return this.layersSvc.activeLayer;
  }

  openAddLayer() {
    this.addLayerMenuOpen = true;
  }

  onMovableListEvent(eventData: LayerListEventData) {
    this.layersSvc.onLayerEvent(eventData);
  }
}
