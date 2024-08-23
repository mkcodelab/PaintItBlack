import { Injectable } from '@angular/core';
import { Layer } from './layer';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  private _layers: Layer[] = [
    new Layer('A'),
    new Layer('B'),
    new Layer('C'),
    new Layer('D'),
    new Layer('E'),
  ];

  private _activeLayer: Layer;

  private activateLayerSubject$ = new Subject<Layer>();

  public activateLayerEvent$ = this.activateLayerSubject$.asObservable();

  createLayer(name: string): void {
    this._layers.push(new Layer(name));
  }

  get layers() {
    return this._layers;
  }

  moveLayer(fromIndex: number, toIndex: number): void {
    const movedElement = this._layers.splice(fromIndex, 1);
    this._layers.splice(toIndex, 0, movedElement[0]);
  }

  moveLayerUp(layer: Layer): void {
    const currentIndex = this._layers.findIndex(
      (searchedLayer) => searchedLayer.uuid === layer.uuid
    );
    if (currentIndex != 0) {
      this.moveLayer(currentIndex, currentIndex - 1);
    }
  }

  moveLayerDown(layer: Layer): void {
    const currentIndex = this._layers.findIndex(
      (searchedLayer) => searchedLayer.uuid === layer.uuid
    );

    if (currentIndex != this._layers.length - 1) {
      this.moveLayer(currentIndex, currentIndex + 1);
    }
  }

  activateLayer(layer: Layer): void {
    this._activeLayer = layer;
    this.activateLayerSubject$.next(this._activeLayer);
  }

  get activeLayer() {
    return this._activeLayer;
  }

  injectContext(uuid: number, ctx: CanvasRenderingContext2D) {
    const layerToModify = this._layers.find((elem) => elem.uuid === uuid);
    if (layerToModify) {
      layerToModify.context = ctx;
    }
  }
}
