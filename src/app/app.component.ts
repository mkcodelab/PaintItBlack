import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasBoxComponent } from './components/canvas-box/canvas-box.component';
import { Toolbox } from './components/toolbox/toolbox.component';
import { LayersComponent } from './components/layers/layers.component';
import { FullscreenButtonComponent } from './components/fullscreen-button/fullscreen-button';
import { TopbarButtonsComponent } from './components/topbar/topbar-buttons/topbar-buttons.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SidebarComponent,
    CanvasBoxComponent,
    Toolbox,
    LayersComponent,
    FullscreenButtonComponent,
    TopbarButtonsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'paintitblack';
}
