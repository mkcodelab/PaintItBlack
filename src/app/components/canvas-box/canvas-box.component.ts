import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { MouseService } from '../mouse/mouse.service';
import {
  concatMap,
  fromEvent,
  mergeMap,
  pairwise,
  Subscription,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CanvasService } from './canvas.service';
import { JsonPipe } from '@angular/common';

export interface MouseCoords {
  x: number;
  y: number;
}

@Component({
  standalone: true,
  selector: 'canvas-box',
  templateUrl: './canvas-box.component.html',
})
export class CanvasBoxComponent implements AfterViewInit {
  canvasSvc = inject(CanvasService);
  //   canvasRect: any;
  mouseCoords: MouseCoords;

  ctx: CanvasRenderingContext2D;

  //   later on use ViewChildren canvasElement to grab querylist of multiple canvas elements

  @ViewChild('canvasElement') canvasElement: ElementRef;

  testDraw() {
    if (this.ctx) {
      this.canvasSvc.drawLine(this.ctx);
    }
  }

  ngAfterViewInit() {
    const canvas = this.canvasElement.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (this.ctx) {
      this.canvasSvc.drawBackground(this.ctx);
    }

    // this.captureEvents();
    this.canvasSvc.captureEvents(canvas, this.ctx);
    this.captureMousePosition(canvas);
  }
  get coordsString(): string {
    if (this.mouseCoords) {
      return (
        'x: ' +
        Math.floor(this.mouseCoords.x) +
        ' y: ' +
        Math.floor(this.mouseCoords.y)
      );
    } else {
      return '';
    }
  }

  captureMousePosition(canvas: HTMLCanvasElement) {
    fromEvent<MouseEvent>(canvas, 'mousemove').subscribe(
      (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();

        this.mouseCoords = {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
    );
  }
}
