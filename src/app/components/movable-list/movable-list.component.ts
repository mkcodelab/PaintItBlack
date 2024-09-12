import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from '../layers/layer';
import { ClickOutsideDirective } from '../../directives/clickOutside.directive';

type ContextMenu = Layer | undefined;

export enum MovableListEvents {
  moveUp,
  moveDown,
  activateLayer,
  removeLayer,
  toggleLayer,
  mergeDown,
  copyLayer,
}

export interface MovableListEventData {
  ev: MovableListEvents;
  layer: Layer;
}

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

  @Output() movableListEvent = new EventEmitter<MovableListEventData>();

  layerContextMenu: ContextMenu = undefined;

  Events = MovableListEvents;

  fireEvent(ev: MovableListEvents, layer: Layer) {
    this.movableListEvent.emit({ ev, layer });
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
}
