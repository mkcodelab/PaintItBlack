import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ListItem {
  name: string;
  uuid: number;
}

@Component({
  standalone: true,
  selector: 'draggable-list',
  templateUrl: 'draggable-list.component.html',
})
export class DraggableListComponent {
  @Input({ required: true }) listItems: ListItem[];

  @Output() moveUpEvent = new EventEmitter();
  @Output() moveDownEvent = new EventEmitter();

  draggingStarted = false;

  onDragStart(event: DragEvent) {
    console.log(event.target);
    this.draggingStarted = true;
    console.log(this.draggingStarted);
    // if(event.target) {
    // }
  }

  onDropEvent(event: DragEvent) {
    event.preventDefault();

    console.log('dropped');
  }

  onDragOverEvent(event: DragEvent) {
    event.preventDefault();
    const target = event.target as HTMLElement;
    console.log(event, target, event.clientY);
    // console.log('dragged over', event);
    // if(event.clientY > )
    // console.log(event.clientY);
    // if (event.dataTransfer) {
    //   event.dataTransfer.dropEffect = 'move';
    // }
  }

  onDragEvent() {
    // console.log('dragging');
  }

  onDragEndEvent(event: DragEvent) {
    this.draggingStarted = false;
  }

  reorderItems() {}

  moveUp(item: ListItem) {
    this.moveUpEvent.emit(item);
  }

  moveDown(item: ListItem) {
    this.moveDownEvent.emit(item);
  }
}
