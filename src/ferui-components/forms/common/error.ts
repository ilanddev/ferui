import { Component } from '@angular/core';

@Component({
  selector: 'fui-control-error',
  template: `
    <ng-content></ng-content>
    `,
  host: { '[class.fui-subtext]': 'true' },
})
export class FuiControlError {}
