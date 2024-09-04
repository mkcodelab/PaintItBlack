import { DOCUMENT, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'fullscreen-button',
  imports: [NgClass],
  template: `
    <div class="flex items-center h-full">
      <button
        class="m-1"
        (click)="toggleFullscreen()"
        [title]="fullscreen ? 'exit fullscreen' : 'fullscreen'"
      >
        <i [ngClass]="fullscreen ? 'icon-minimize' : 'icon-maximize'"></i>
      </button>
    </div>
  `,
})
export class FullscreenButtonComponent {
  document = inject(DOCUMENT);
  fullscreen = false;
  toggleFullscreen() {
    if (!this.document.fullscreenElement) {
      this.document.documentElement.requestFullscreen();
      this.fullscreen = true;
    } else {
      this.document.exitFullscreen();
      this.fullscreen = false;
    }
  }
}
