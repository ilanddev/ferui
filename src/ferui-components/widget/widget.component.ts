import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget',
  host: { '[class.fui-widget]': 'true' },
  template: `
    <ng-content select="fui-widget-header"></ng-content>
    <ng-content select="fui-widget-body"></ng-content>
    <ng-content select="fui-widget-footer"></ng-content>
  `
})
export class FuiWidget {}
