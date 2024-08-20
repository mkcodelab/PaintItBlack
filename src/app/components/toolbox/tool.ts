export interface ToolConfig {
  options: ToolOptions[];
}

export interface ToolOptions {}

export class Tool {
  constructor(
    public name: string,
    public icon: string,
    public toolConfig: ToolConfig
  ) {}
}
