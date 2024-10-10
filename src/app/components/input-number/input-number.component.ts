import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  //   use nullish coalescing somewhere
  @Input() set value(value: number) {
    this._value = value;
  }

  //   we can use custom two-way binding syntax with Change suffix
  @Output() valueChange = new EventEmitter<number>();

  get value(): number {
    if (this._value !== null) {
      return +this._value.toFixed(3);
    } else {
      return 0;
    }
  }

  increment() {
    if (this.max) {
      if (this._value < this.max) {
        this._value += this.step;
      }
    } else {
      this._value += this.step;
    }

    this.valueChange.emit(this.value);
  }

  decrement() {
    if (this.min !== undefined) {
      if (this._value > this.min) {
        this._value -= this.step;
      }
    } else {
      this._value -= this.step;
    }

    this.valueChange.emit(this.value);
  }

  manualInput(value: string) {
    this._value = Number(value);
    this.valueChange.emit(this.value);
  }
}
