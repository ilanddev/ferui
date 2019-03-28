/**
 * Class:  DemoComponentData
 * This class handles data for a Demo Component
 */
export class DemoComponentData {
  public source: string; // Source code of the demo component
  public title: string; // Title
  public models: object; // Models used by the demo component {one: 'one', two: 'two', ...}
  public params: object; // Parameters used by the demo component {paramOne: 'one', paramTwo: 'two', ...}
  public canDisable: boolean; // Boolean that indicates if demo component can be disabled

  constructor(data: { title: string; source: string; models?: object; params?: object; canDisable?: boolean }) {
    this.title = data.title;
    this.source = data.source;
    this.models = data.models;
    this.params = data.params || {};
    this.canDisable = !!data.canDisable;
  }
}
