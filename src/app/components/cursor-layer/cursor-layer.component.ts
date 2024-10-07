import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, map, Observable } from 'rxjs';
import { ToolboxService } from '../toolbox/toolbox.service';
import { ToolType } from '../toolbox/tool';

@Component({
  selector: 'cursor-layer',
  standalone: true,
  imports: [],
  templateUrl: './cursor-layer.component.html',
  styleUrl: './cursor-layer.component.scss',
})
export class CursorLayerComponent implements AfterViewInit, OnInit {
  @Input() width: number;
  @Input() height: number;

  toolboxSvc = inject(ToolboxService);

  mousePosition$: Observable<{ x: number; y: number }>;

  cursorPosition = {
    x: 0,
    y: 0,
  };

  cursorStyles = {
    width: 10,
    height: 10,
  };

  @ViewChild('cursor') cursorElement: ElementRef;
  @ViewChild('cursorWrapper') cursorWrapper: ElementRef;

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    const cursorWrapperElement = this.cursorWrapper.nativeElement;

    this.mousePosition$ = fromEvent<MouseEvent>(
      cursorWrapperElement,
      'mousemove'
    ).pipe(
      map((ev: MouseEvent) => {
        const rect = cursorWrapperElement.getBoundingClientRect();
        const x =
          Math.floor(ev.clientX - rect.left) - this.cursorStyles.width / 2;
        const y =
          Math.floor(ev.clientY - rect.top) - this.cursorStyles.height / 2;
        return { x, y };
      })
    );

    this.mousePosition$.subscribe((data) => {
      this.cursorPosition.x = data.x;
      this.cursorPosition.y = data.y;
    });
  }

  //   we can switch cursor image when specific tool is selected i.e. bucket fill tool
  getStyles() {
    return `width: ${this.cursorStyles.width}px; height: ${this.cursorStyles.height}px; border-radius: 50%;
    border: 1px solid white;`;
  }

  init() {
    this.toolboxSvc.dataChangeEvent$.subscribe((data) => {
      switch (this.toolboxSvc.selectedTool?.toolType) {
        case ToolType.PENCIL:
          this.cursorStyles.width = this.cursorStyles.height = data.lineWidth;
          break;
        case ToolType.SPREAD:
          this.cursorStyles.width = this.cursorStyles.height =
            data.spreadRadius * 2;
          break;
        default:
          break;
      }
    });
  }
}
