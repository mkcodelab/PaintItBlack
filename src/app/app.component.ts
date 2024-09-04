import { Component, inject } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CanvasBoxComponent } from './components/canvas-box/canvas-box.component';
import { Toolbox } from './components/toolbox/toolbox.component';
import { LayersComponent } from './components/layers/layers.component';
import { FullscreenButtonComponent } from './components/fullscreen-button/fullscreen-button';
import { TopbarButtonsComponent } from './components/topbar/topbar-buttons/topbar-buttons.component';
import { ModalService } from './services/modal-service/modal.service';
import { ModalComponent } from './components/modal/modal.component';
import { LoggerScreenComponent } from './components/logger-screen/logger-screen.component';

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
    ModalComponent,
    LoggerScreenComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'paintitblack';
  modalSvc = inject(ModalService);

  get modalOpen() {
    return this.modalSvc.isOpen;
  }
}
