import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget-title',
  host: { '[class.fui-widget-title]': 'true' },
  template: `
    <div class="fui-widget-title-text"><ng-content></ng-content></div>
  `
})
export class FuiWidgetTitle {}
