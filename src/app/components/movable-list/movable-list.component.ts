import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from '../layers/layer';
import { ClickOutsideDirective } from '../../directives/clickOutside.directive';

type ContextMenu = Layer | undefined;

@Component({
  standalone: true,
  selector: 'movable-list',
  templateUrl: 'movable-list.component.html',
  imports: [NgClass, ClickOutsideDirective],
  styles: `
    .moveButton, .context-menu-button {
        &:disabled {
            opacity: 0.4
        }
    }

  `,
})
export class MovableListComponent {
  @Input({ required: true }) listItems: Layer[];
  @Input() activeLayer: Layer;

  @Output() moveUpEvent = new EventEmitter();
  @Output() moveDownEvent = new EventEmitter();
  @Output() activateLayer = new EventEmitter();
  @Output() removeLayerEvent = new EventEmitter();
  @Output() toggleLayerEvent = new EventEmitter();

  layerContextMenu: ContextMenu = undefined;

  moveUp(item: Layer) {
    this.moveUpEvent.emit(item);
  }

  moveDown(item: Layer) {
    this.moveDownEvent.emit(item);
  }

  removeLayer(item: Layer) {
    this.removeLayerEvent.emit(item);
  }

  toggleLayer(item: Layer) {
    this.toggleLayerEvent.emit(item);
  }

  activate(item: Layer) {
    this.activateLayer.emit(item);
  }

  isActive(item: Layer) {
    return item === this.activeLayer;
  }

  displayContextMenu(item: Layer): void {
    this.layerContextMenu = item;
  }

  isContextMenuOpen(item: Layer): boolean {
    return this.layerContextMenu === item;
  }

  closeContextMenu() {
    this.layerContextMenu = undefined;
  }

  mergeDown(item: Layer) {
    console.log('merging down');
  }
  copyLayer(item: Layer) {
    console.log('copying layer');
  }
}
