import { Directive } from '@angular/core';
import { ControlReference } from '../common/control-reference';

@Directive({
  selector: 'fui-radio-container fui-radio-wrapper input',
})
export class RadioReference extends ControlReference {}
