import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { DropdownComponent } from '../../dropdown/dropdown.component';
import { ModalService } from '../../../services/modal-service/modal.service';
import { SaveImageService } from '../../../services/save-image.service';
import { SvgScreenComponent } from '../../svg-generator/svg-screen.component';

@Component({
  standalone: true,
  selector: 'topbar-buttons',
  templateUrl: './topbar-buttons.component.html',
  imports: [DropdownComponent, SvgScreenComponent],
})
export class TopbarButtonsComponent {
  modalSvc = inject(ModalService);
  saveImageSvc = inject(SaveImageService);

  buttons = [
    {
      name: 'file',
      contentOpen: false,
      content: [
        { name: 'save', function: this.openSaveFileModal.bind(this) },
        { name: 'test' },
      ],
    },
    {
      name: 'edit',
      contentOpen: false,
      content: [
        { name: 'undo', function: 'undo' },
        { name: 'redo', function: 'redo' },
      ],
    },
    {
      name: 'generate',
      contentOpen: false,
      content: [{ name: 'noise', function: this.openNoiseModal.bind(this) }],
    },
    { name: 'about', content: [] },
  ];

  @ViewChild('saveContent') saveContent: TemplateRef<any>;
  @ViewChild('svgNoiseContent') svgNoiseContent: TemplateRef<any>;

  openSaveFileModal() {
    this.modalSvc.open(this.saveContent, { title: 'Save image file' });
  }

  saveImage() {
    this.saveImageSvc.downloadCanvas();
  }

  openNoiseModal() {
    this.modalSvc.open(this.svgNoiseContent, { title: 'Perlin Noise' });
  }
}
