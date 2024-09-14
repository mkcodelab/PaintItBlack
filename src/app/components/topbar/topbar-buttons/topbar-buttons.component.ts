import { Component, inject, TemplateRef } from '@angular/core';
import { DropdownComponent } from '../../dropdown/dropdown.component';
import { ModalService } from '../../../services/modal-service/modal.service';
import { SaveImageService } from '../../../services/save-image.service';
import { SvgScreenComponent } from '../../svg-generator/svg-screen.component';
import { ProjectSettingsComponent } from '../../project-settings/project-settings.component';
import { DropdownMenuComponent } from '../../dropdown-menu/dropdown-menu.component';
import { AboutComponent } from '../../about/about.component';
import { LayersService } from '../../layers/layers.service';
import { FiltersComponent } from '../../filters/filters.component';

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
    FiltersComponent,
  ],
})
export class TopbarButtonsComponent {
  modalSvc = inject(ModalService);
  saveImageSvc = inject(SaveImageService);
  layersSvc = inject(LayersService);

  saveImage() {
    this.saveImageSvc.downloadCanvas();
  }

  openModal(modalRef: TemplateRef<any>, title: string) {
    this.modalSvc.open(modalRef, { title: title });
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
