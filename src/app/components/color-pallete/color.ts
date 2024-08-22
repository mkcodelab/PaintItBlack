export interface ColorChannels {
  r: number;
  g: number;
  b: number;
  a: number;
}
export class Color {
  constructor(public channels: ColorChannels) {}
}
