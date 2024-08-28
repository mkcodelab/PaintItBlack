import { inject, Injectable } from '@angular/core';
import { LayersService } from '../../components/layers/layers.service';

@Injectable({
  providedIn: 'root',
})
export class SaveImageService {
  layersSvc = inject(LayersService);
  fileType = 'image/png';
  quality = 1;

  downloadCanvas() {
    const canvas = this.layersSvc.mergeAllLayers();
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const anchor = document.createElement('a');
          anchor.download = 'canvas.png';
          anchor.href = URL.createObjectURL(blob);
          anchor.click();
          URL.revokeObjectURL(anchor.href);
        }
      },
      this.fileType,
      this.quality
    );
  }
}
