import { Component } from '@angular/core';
import { Toolbox } from '../toolbox/toolbox.component';

@Component({
  standalone: true,
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  imports: [Toolbox],
})
export class SidebarComponent {}
