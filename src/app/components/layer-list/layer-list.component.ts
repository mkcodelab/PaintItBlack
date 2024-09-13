import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from '../layers/layer';
import { ClickOutsideDirective } from '../../directives/clickOutside.directive';
import { LayerListEventData, LayerListEvents } from '../layers/layers.service';

type ContextMenu = Layer | undefined;

@Component({
  standalone: true,
  selector: 'layer-list',
  templateUrl: 'layer-list.component.html',
  imports: [NgClass, ClickOutsideDirective],
  styles: `
    .moveButton, .context-menu-button {
        &:disabled {
            opacity: 0.4
        }
    }

  `,
})
export class LayerListComponent {
  @Input({ required: true }) layers: Layer[];
  @Input() activeLayer: Layer;

  @Output() layerListEvent = new EventEmitter<LayerListEventData>();

  layerContextMenu: ContextMenu = undefined;

  Events = LayerListEvents;

  fireEvent(ev: LayerListEvents, layer: Layer) {
    this.layerListEvent.emit({ ev, layer });
  }

  isActive(layer: Layer) {
    return layer === this.activeLayer;
  }

  displayContextMenu(layer: Layer): void {
    this.layerContextMenu = layer;
  }

  isContextMenuOpen(layer: Layer): boolean {
    return this.layerContextMenu === layer;
  }

  closeContextMenu() {
    this.layerContextMenu = undefined;
  }
}
