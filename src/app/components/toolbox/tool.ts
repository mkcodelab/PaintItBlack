export interface ToolConfig {
  options: ToolOptions[];
}

export interface ToolOptions {}

export enum ToolType {
  PENCIL,
  ERASER,
  LINE,
  SQUARE,
  ELLIPSE,
  FILL,
  SPREAD,
}

export class Tool {
  constructor(
    public name: string,
    public toolType: ToolType,
    public toolConfig?: ToolConfig
  ) {}
}
