import { inject, Injectable } from '@angular/core';
import { Layer } from './layer';
import { Subject } from 'rxjs';
import { ProjectDataService } from '../../services/project-data.service';

export enum LayerListEvents {
  moveUp,
  moveDown,
  activateLayer,
  removeLayer,
  toggleLayer,
  mergeDown,
  copyLayer,
  renameLayer,
}

export interface LayerListEventData {
  ev: LayerListEvents;
  layer: Layer;
  data?: any;
}

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
    this._layers.unshift(new Layer(name));
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
      layer.context.canvas.width,
      layer.context.canvas.height
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

  mergeLayerDown(layer: Layer) {
    const topLayerIndex = this.findLayerIndex(layer);
    const layerBelowIndex = topLayerIndex + 1;
    const image = this._layers[topLayerIndex].context.canvas;
    const ctxToDraw = this._layers[layerBelowIndex].context;

    ctxToDraw.drawImage(image, 0, 0);

    this.removeLayer(layer);
  }

  copyLayer(layer: Layer) {
    const copiedLayer = new Layer(layer.name + ' (copy)');

    const copiedLayerImage = layer.context.canvas;
    // no context because ctx is injected from outside...
    // copiedLayer.context.drawImage(copiedLayerImage, 0, 0);

    setTimeout(() => {
      copiedLayer.context.drawImage(copiedLayerImage, 0, 0);
    }, 200);
    const copiedItemIndex = this.findLayerIndex(layer);
    // use splice instead push, to insert after copied layer
    this._layers.splice(copiedItemIndex + 1, 0, copiedLayer);
  }

  renameLayer(newName: string, layer: Layer) {
    layer.name = newName;
  }

  //   response to layer event (movable layer component events)
  onLayerEvent(eventData: LayerListEventData) {
    switch (eventData.ev) {
      case LayerListEvents.toggleLayer:
        this.toggleLayer(eventData.layer);
        break;
      case LayerListEvents.activateLayer:
        this.activateLayer(eventData.layer);
        break;
      case LayerListEvents.moveDown:
        this.moveLayerDown(eventData.layer);
        break;
      case LayerListEvents.moveUp:
        this.moveLayerUp(eventData.layer);
        break;
      case LayerListEvents.removeLayer:
        this.removeLayer(eventData.layer);
        break;
      case LayerListEvents.mergeDown:
        this.mergeLayerDown(eventData.layer);
        break;
      case LayerListEvents.copyLayer:
        this.copyLayer(eventData.layer);
        break;
      case LayerListEvents.renameLayer:
        this.renameLayer(eventData.data, eventData.layer);
        break;
      default:
        console.warn('not implemented yet!');
        break;
    }
  }

  addActiveLayerOperation() {
    this._activeLayer.addOperation();
  }

  layerUndo() {
    if (this._activeLayer) {
      this._activeLayer.undo();
    } else {
      console.warn('layer not selected');
    }
  }

  layerRedo() {
    if (this._activeLayer) {
      this._activeLayer.redo();
    } else {
      console.warn('layer not selected');
    }
  }
}
