import { Component, ContentChild } from '@angular/core';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiLabel } from '../common/label';

@Component({
  selector: 'fui-checkbox-wrapper',
  template: `
    <ng-content select="[fuiCheckbox]"></ng-content>
    <ng-content select="label"></ng-content>
    <label *ngIf="!label"></label>
  `,
  host: {
    '[class.fui-checkbox-wrapper]': 'true',
  },
  providers: [ControlIdService],
})
export class FuiCheckboxWrapper implements DynamicWrapper {
  _dynamic = false;
  @ContentChild(FuiLabel) label: FuiLabel;
}
