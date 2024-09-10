import { Component, Input } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/clickOutside.directive';

@Component({
  selector: 'dropdown-menu',
  standalone: true,
  imports: [ClickOutsideDirective],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
})
export class DropdownMenuComponent {
  @Input({ required: true }) title: string;
  isMenuOpen = false;

  openDropdown() {
    this.isMenuOpen = true;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
