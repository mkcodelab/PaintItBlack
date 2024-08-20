import { Injectable } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MouseService {
  public mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');

  //   private coordinates$ = new Subject();

  //   public mouseCoordinates$ = this.mouseMove$.asObservable();

  //   changeCoordinates(x: number, y: number) {
  //     this.coordinates$.next({ x, y });
  //   }
}
