import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ProjectDataService } from '../../services/project-data.service';
import { CanvasService } from '../canvas-box/canvas.service';

@Component({
  standalone: true,
  selector: 'svg-screen',
  templateUrl: './svg-screen.component.html',
})
export class SvgScreenComponent {
  projectDataSvc = inject(ProjectDataService);
  canvasSvc = inject(CanvasService);

  width = this.projectDataSvc.canvasSize.width;
  height = this.projectDataSvc.canvasSize.height;

  @ViewChild('noise') noiseElement: ElementRef<SVGImageElement>;

  generateNoise() {
    this.canvasSvc.drawSvgImage(this.noiseElement.nativeElement);
  }
}
