import { Injectable } from '@angular/core';
import { Layer } from './layer';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  private _layers: Layer[] = [];

  createLayer(name: string) {
    const index = this._layers.length;
    const layer = new Layer(name, index);

    this._layers.push(layer);
  }

  get layers() {
    return this._layers;
  }
}
