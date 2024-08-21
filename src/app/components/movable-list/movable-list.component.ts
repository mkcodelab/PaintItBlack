import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from '../layers/layer';

export interface ListItem {
  name: string;
  uuid: number;
}

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
  @Input({ required: true }) listItems: ListItem[];
  @Input() activeLayer: Layer;

  @Output() moveUpEvent = new EventEmitter();
  @Output() moveDownEvent = new EventEmitter();
  @Output() activateLayer = new EventEmitter();

  moveUp(item: ListItem) {
    this.moveUpEvent.emit(item);
  }

  moveDown(item: ListItem) {
    this.moveDownEvent.emit(item);
  }

  activate(item: ListItem) {
    this.activateLayer.emit(item);
  }

  isActive(item: ListItem) {
    return item === this.activeLayer;
  }
}
