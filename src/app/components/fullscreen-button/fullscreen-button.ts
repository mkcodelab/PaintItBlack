import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'fullscreen-button',
  template: `
    <button
      class="m-1"
      (click)="toggleFullscreen()"
      [title]="fullscreen ? 'exit fullscreen' : 'fullscreen'"
    >
      🧱
    </button>
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
