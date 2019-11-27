import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget-body',
  host: { '[class.fui-widget-body]': 'true' },
  template: `
    <ng-content></ng-content>
  `,
})
export class FuiWidgetBody {}
