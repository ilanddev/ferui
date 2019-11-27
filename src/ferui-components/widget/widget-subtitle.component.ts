import { Component } from '@angular/core';

@Component({
  selector: 'fui-widget-subtitle',
  host: { '[class.fui-widget-subtitle]': 'true' },
  template: `
    <div class="fui-widget-subtitle-text"><ng-content></ng-content></div>
  `,
})
export class FuiWidgetSubtitle {}
