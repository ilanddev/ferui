import { Directive } from '@angular/core';
import { ControlReference } from '../common/control-reference';

@Directive({
  selector: 'fui-input-container input',
})
export class InputReference extends ControlReference {}
