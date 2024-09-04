import { Injectable } from '@angular/core';

export type LoggerMessage = 'log' | 'warn' | 'error';

export interface LoggerMessageObject {
  text: string;
  messageType: LoggerMessage;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private _message: LoggerMessageObject;
  isMessageVisible = false;

  log(message: string) {
    this._message = { text: message, messageType: 'log' };
    this.showMessage();
  }

  warn(message: string) {
    this._message = { text: message, messageType: 'warn' };
    this.showMessage();
  }

  error(message: string) {
    this._message = { text: message, messageType: 'error' };
    this.showMessage();
  }

  get message() {
    return this._message;
  }

  showMessage() {
    this.isMessageVisible = true;
  }

  hideMessage() {
    this.isMessageVisible = false;
  }
}
