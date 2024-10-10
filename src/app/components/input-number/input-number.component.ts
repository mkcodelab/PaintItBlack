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
    this._value = value ?? 0;
  }

  //   we can use custom two-way binding syntax with Change suffix
  @Output() valueChange = new EventEmitter<number>();
  @Output() change = new EventEmitter<number>();

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

    this.change.emit(this.value);
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

    this.change.emit(this.value);
    this.change.emit(this.value);
  }
}
