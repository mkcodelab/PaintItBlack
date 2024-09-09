import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  public canvasSize = {
    width: 1000,
    height: 600,
  };

  private projectResizeSubject = new Subject();
  public projectResizeEvent$ = this.projectResizeSubject.asObservable();

  //   resizing canvas causes the context to be cleared, so we need some method to store ctx.imageData and then repaint it on the resized canvas
  resize(width: number, height: number) {
    this.canvasSize.width = width;
    this.canvasSize.height = height;
    this.projectResizeSubject.next(this.canvasSize);
  }
}
