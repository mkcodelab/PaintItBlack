import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'topbar-buttons',
  template: `
    <div>
      @for(button of buttons; track button) {
      <button
        class="border border-white p-1 m-1 text-white pointer hover:bg-neutral-400"
      >
        {{ button.name }}
      </button>
      }
    </div>
  `,
})
export class TopbarButtonsComponent {
  buttons = [{ name: 'file' }, { name: 'edit' }, { name: 'about' }];
}
