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

  isRenameInputOpen = false;

  Events = LayerListEvents;

  fireEvent(ev: LayerListEvents, layer: Layer, data?: any) {
    this.layerListEvent.emit({ ev, layer, data });
    this.closeContextMenu();
  }

  isActive(layer: Layer) {
    return layer === this.activeLayer;
  }

  displayContextMenu(layer: Layer): void {
    this.fireEvent(this.Events.activateLayer, layer);
    this.layerContextMenu = layer;
  }

  isContextMenuOpen(layer: Layer): boolean {
    return this.layerContextMenu === layer;
  }

  closeContextMenu() {
    this.layerContextMenu = undefined;
  }

  openRenameInput(inputEl: HTMLInputElement) {
    // it works with setTimeout
    setTimeout(() => inputEl.focus(), 0);
    this.isRenameInputOpen = true;
  }

  onRenameConfirm(newName: string, layer: Layer) {
    if (newName) {
      this.fireEvent(this.Events.renameLayer, layer, newName);
    }
    this.isRenameInputOpen = false;
  }

  onEnterKeyUp(ev: KeyboardEvent, value: string, layer: Layer) {
    ev.key === 'Enter' ? this.onRenameConfirm(value, layer) : null;
  }
}
