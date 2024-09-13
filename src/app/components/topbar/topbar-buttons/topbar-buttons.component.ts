import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { DropdownComponent } from '../../dropdown/dropdown.component';
import { ModalService } from '../../../services/modal-service/modal.service';
import { SaveImageService } from '../../../services/save-image.service';
import { SvgScreenComponent } from '../../svg-generator/svg-screen.component';
import { ProjectSettingsComponent } from '../../project-settings/project-settings.component';
import { DropdownMenuComponent } from '../../dropdown-menu/dropdown-menu.component';
import { AboutComponent } from '../../about/about.component';
import { LayersService } from '../../layers/layers.service';

@Component({
  standalone: true,
  selector: 'topbar-buttons',
  templateUrl: './topbar-buttons.component.html',
  imports: [
    DropdownComponent,
    SvgScreenComponent,
    ProjectSettingsComponent,
    DropdownMenuComponent,
    AboutComponent,
  ],
})
export class TopbarButtonsComponent {
  modalSvc = inject(ModalService);
  saveImageSvc = inject(SaveImageService);
  layersSvc = inject(LayersService);

  @ViewChild('saveContent') saveContent: TemplateRef<any>;
  @ViewChild('svgNoiseContent') svgNoiseContent: TemplateRef<any>;
  @ViewChild('projectSettingsContent') projectSettingsContent: TemplateRef<any>;
  @ViewChild('aboutContent') aboutContent: TemplateRef<any>;

  openSaveFileModal() {
    this.modalSvc.open(this.saveContent, { title: 'Save image file' });
  }

  saveImage() {
    this.saveImageSvc.downloadCanvas();
  }

  openNoiseModal() {
    this.modalSvc.open(this.svgNoiseContent, { title: 'Perlin Noise' });
  }

  openProjectModal() {
    this.modalSvc.open(this.projectSettingsContent, {
      title: 'Project Settings',
    });
  }

  openAboutModal() {
    this.modalSvc.open(this.aboutContent, { title: 'Paint It Black' });
  }

  closeModal() {
    this.modalSvc.close();
  }

  undo() {
    this.layersSvc.layerUndo();
  }

  redo() {
    this.layersSvc.layerRedo();
  }
}
