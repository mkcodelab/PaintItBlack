import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  public canvasSize = {
    width: 1000,
    height: 600,
  };
}
