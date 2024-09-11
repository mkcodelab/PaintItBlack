import { Component, inject } from '@angular/core';
import { ProjectDataService } from '../../services/project-data.service';
import { InputNumberComponent } from '../input-number/input-number.component';

@Component({
  standalone: true,
  selector: 'project-settings',
  templateUrl: './project-settings.component.html',
  imports: [InputNumberComponent],
})
export class ProjectSettingsComponent {
  projectDataSvc = inject(ProjectDataService);

  resize(width: number, height: number) {
    this.projectDataSvc.resize(width, height);
  }
}
