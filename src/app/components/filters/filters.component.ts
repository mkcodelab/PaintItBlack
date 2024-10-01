import { Component, EventEmitter, inject, Output } from '@angular/core';
import { InputNumberComponent } from '../input-number/input-number.component';
import { CanvasService } from '../canvas-box/canvas.service';

export interface FiltersData {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  hueRotate: number;
  invert: number;
  opacity: number;
  saturate: number;
  sepia: number;
}

@Component({
  selector: 'filters',
  standalone: true,
  imports: [InputNumberComponent],
  templateUrl: './filters.component.html',
})
export class FiltersComponent {
  canvasSvc = inject(CanvasService);
  @Output() confirm = new EventEmitter();

  filtersData: FiltersData = {
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    hueRotate: 0,
    invert: 0,
    opacity: 100,
    saturate: 100,
    sepia: 0,
  };

  filters = Object.keys(this.filtersData);

  applyFilters() {
    this.canvasSvc.applyFilters(this.filtersData);
    this.confirm.emit();
  }

  changeFiltersData(filter: string, data: number) {
    this.filtersData[filter as keyof typeof this.filtersData] = data;
  }

  getFilterValue(filter: string) {
    return this.filtersData[filter as keyof typeof this.filtersData];
  }
}
