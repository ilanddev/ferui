import { Directive } from '@angular/core';
import { ControlReference } from '../common/control-reference';

@Directive({
  selector: 'fui-password-container input',
})
export class PasswordReference extends ControlReference {}
