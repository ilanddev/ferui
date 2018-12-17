import { Directive } from '@angular/core';
import { ControlReference } from '../common/control-reference';

@Directive({
  selector: 'fui-checkbox-container fui-checkbox-wrapper input',
})
export class CheckboxReference extends ControlReference {}
