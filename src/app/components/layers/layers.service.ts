import { inject, Injectable } from '@angular/core';
import { Layer } from './layer';
import { Subject } from 'rxjs';
import { ProjectDataService } from '../../services/project-data.service';

@Injectable({
  providedIn: 'root',
})
export class LayersService {
  private _layers: Layer[] = [new Layer('A'), new Layer('B'), new Layer('C')];

  private _activeLayer: Layer;

  private activateLayerSubject$ = new Subject<Layer>();

  public activateLayerEvent$ = this.activateLayerSubject$.asObservable();

  private projectDataSvc = inject(ProjectDataService);

  createLayer(name: string): void {
    this._layers.push(new Layer(name));
  }

  get layers(): Layer[] {
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

  get activeLayer(): Layer {
    return this._activeLayer;
  }

  injectContext(uuid: string, ctx: CanvasRenderingContext2D): void {
    const layerToModify = this._layers.find((elem) => elem.uuid === uuid);
    if (layerToModify) {
      layerToModify.context = ctx;
    }
  }

  getLayerImageData(layer: Layer): ImageData {
    const ctx = layer.context;
    const data = ctx.getImageData(
      0,
      0,
      layer.canvas.width,
      layer.canvas.height
    );
    return data;
  }

  //   merging all visible layers together
  mergeAllLayers(): HTMLCanvasElement {
    // create new canvas element
    const mergedCanvas = document.createElement('canvas');
    // get data from canvasSize object later
    mergedCanvas.width = this.projectDataSvc.canvasSize.width;
    mergedCanvas.height = this.projectDataSvc.canvasSize.height;

    const ctx = mergedCanvas.getContext('2d');
    // iterate over layers in reverse order
    for (let layer of this._layers.slice().reverse()) {
      if (layer.visible) {
        ctx?.drawImage(layer.context.canvas, 0, 0);
      }
    }

    return mergedCanvas;
  }
}
