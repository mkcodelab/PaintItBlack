import { Injectable } from '@angular/core';
import { Layer } from './layer';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  private _layers: Layer[] = [new Layer('A'), new Layer('B'), new Layer('C')];

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

  removeLayer(layerToRemove: Layer): void {
    const index = this.findLayerIndex(layerToRemove);
    this._layers.splice(index, 1);
  }

  findLayerIndex(layer: Layer): number {
    return this._layers.findIndex((_layer) => _layer.uuid === layer.uuid);
  }

  toggleLayer(layer: Layer): void {
    const index = this.findLayerIndex(layer);
    this._layers[index].visible = !this._layers[index].visible;
  }

  isLayerVisible(layer: Layer): boolean {
    return this._layers[this.findLayerIndex(layer)].visible;
  }

  get activeLayer() {
    return this._activeLayer;
  }

  injectContext(uuid: string, ctx: CanvasRenderingContext2D) {
    const layerToModify = this._layers.find((elem) => elem.uuid === uuid);
    if (layerToModify) {
      layerToModify.context = ctx;
    }
  }
}
