import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget-footer',
  host: { '[class.fui-widget-footer]': 'true' },
  template: `
    <ng-content></ng-content>
  `,
})
export class FuiWidgetFooter {}
