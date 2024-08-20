import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasBoxComponent } from './components/canvas-box/canvas-box.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, CanvasBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'paintitblack';
}
