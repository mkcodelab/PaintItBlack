import { Component } from '@angular/core';

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
  fullscreen = false;
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.fullscreen = true;
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      this.fullscreen = false;
    }
  }
}
