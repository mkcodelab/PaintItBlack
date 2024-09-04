import { Component, inject } from '@angular/core';
import {
  LoggerMessageObject,
  LoggerService,
} from '../../services/logger.service';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'logger-screen',
  imports: [NgClass],
  styleUrl: './logger-screen.scss',
  templateUrl: './logger-screen.component.html',
})
export class LoggerScreenComponent {
  loggerSvc = inject(LoggerService);

  get message(): LoggerMessageObject {
    return this.loggerSvc.message;
  }

  close() {
    this.loggerSvc.hideMessage();
  }

  get isVisible() {
    return this.loggerSvc.isMessageVisible;
  }

  get messageClass(): string {
    switch (this.message.messageType) {
      case 'log':
        return 'logger-log';
      case 'warn':
        return 'logger-warn';
      case 'error':
        return 'logger-error';
    }
  }
}
