import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from '../layers/layer';

// export interface ListItem {
//   name: string;
//   uuid: string;
// }

@Component({
  standalone: true,
  selector: 'movable-list',
  templateUrl: 'movable-list.component.html',
  imports: [NgClass],
  styles: `
    .moveButton {
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
}
