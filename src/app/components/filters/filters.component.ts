import { Component, EventEmitter, inject, Output } from '@angular/core';
import { InputNumberComponent } from '../input-number/input-number.component';
import { CanvasService } from '../canvas-box/canvas.service';

@Component({
  selector: 'filters',
  standalone: true,
  imports: [InputNumberComponent],
  templateUrl: './filters.component.html',
})
export class FiltersComponent {
  canvasSvc = inject(CanvasService);

  @Output() confirm = new EventEmitter();

  // rename to applyFilter, and make it more generic
  applyBlur(stdDiviation: number) {
    this.canvasSvc.applyBlur(stdDiviation);
    this.confirm.emit();
  }
}
