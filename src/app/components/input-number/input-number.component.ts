import { Component, Input } from '@angular/core';

@Component({
  selector: 'input-number',
  standalone: true,
  imports: [],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent {
  @Input() value: number = 0;
  @Input() step: number = 1;
  @Input() min: number;
  @Input() max: number;
  @Input() label: string;

  increment() {
    if (this.max) {
      if (this.value < this.max) {
        this.value += this.step;
      }
    } else {
      this.value += this.step;
    }
  }

  decrement() {
    if (this.min !== undefined) {
      if (this.value > this.min) {
        this.value -= this.step;
      }
    } else {
      this.value -= this.step;
    }
  }
}
