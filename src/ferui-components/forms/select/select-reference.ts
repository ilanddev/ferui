import { Directive } from '@angular/core';
import { ControlReference } from '../common/control-reference';

@Directive({
  selector: 'fui-select-container ng-select, fui-select-container select',
})
export class SelectReference extends ControlReference {}
