import { Directive } from '@angular/core';
import { ControlReference } from '../common/control-reference';

@Directive({
  selector: 'fui-textarea-container textarea',
})
export class TextareaReference extends ControlReference {}
