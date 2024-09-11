import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  ViewChild,
} from '@angular/core';
import { ProjectDataService } from '../../services/project-data.service';
import { CanvasService } from '../canvas-box/canvas.service';
import { InputNumberComponent } from '../input-number/input-number.component';

@Component({
  standalone: true,
  selector: 'svg-screen',
  templateUrl: './svg-screen.component.html',
  imports: [InputNumberComponent],
})
export class SvgScreenComponent {
  projectDataSvc = inject(ProjectDataService);
  canvasSvc = inject(CanvasService);

  @Output() confirm = new EventEmitter();

  width = this.projectDataSvc.canvasSize.width;
  height = this.projectDataSvc.canvasSize.height;

  isSaturated = true;

  @ViewChild('noise') noiseElement: ElementRef<SVGImageElement>;

  generateNoise() {
    this.canvasSvc.drawSvgImage(this.noiseElement.nativeElement);
    this.confirm.emit();
  }

  toggleSaturation() {
    this.isSaturated = !this.isSaturated;
  }
}
