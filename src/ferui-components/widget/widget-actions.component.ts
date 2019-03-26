import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget-actions',
  host: { '[class.fui-widget-actions]': 'true' },
  template: `
    <ng-content></ng-content>
  `,
})
export class FuiWidgetActions {}
