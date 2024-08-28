import { Component, Input } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/clickOutside.directive';

@Component({
  standalone: true,
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  imports: [ClickOutsideDirective],
})
export class DropdownComponent {
  @Input({ required: true }) title: string;
  @Input({ required: true }) content: any[];

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  clickedOutside() {
    this.isMenuOpen = false;
  }

  onMenuItemClick(fn: () => {}) {
    if (fn) {
      fn();
    }
  }
}
