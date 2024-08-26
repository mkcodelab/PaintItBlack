import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'base-canvas',
  template: ``,
})
export abstract class BaseCanvasComponent {
  @Input({ required: true }) width: number;
  @Input({ required: true }) height: number;
}
