import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';

export interface ModalConfig {
  title?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = false;
  config: ModalConfig;

  template: TemplateRef<any>;

  private _view: EmbeddedViewRef<any>;

  open(template: TemplateRef<any>, config: ModalConfig) {
    this.config = config;

    this.isOpen = true;
    this.template = template;
  }

  get view() {
    return this._view;
  }

  close() {
    this.isOpen = false;
  }
}
