import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'input-number',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-number.component.html',
  styleUrl: './input-number.component.scss',
})
export class InputNumberComponent {
  private _value: number = 0;
  @Input() step: number = 1;
  @Input() min: number;
  @Input() max: number;
  @Input() label: string;

  @Input() set value(value: number) {
    this._value = value;
  }
  get value() {
    return +this._value.toFixed(3);
  }

  increment() {
    if (this.max) {
      if (this._value < this.max) {
        this._value += this.step;
      }
    } else {
      this._value += this.step;
    }
  }

  decrement() {
    if (this.min !== undefined) {
      if (this._value > this.min) {
        this._value -= this.step;
      }
    } else {
      this._value -= this.step;
    }
  }
}
