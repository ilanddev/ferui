import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'fui-control-error',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[class.fui-subtext]': 'true',
    '[attr.hidden]': 'displayOn === false ? true : null'
  }
})
export class FuiControlError {
  @Input() displayOn: boolean;
}
