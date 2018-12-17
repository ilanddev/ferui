import { NgControl } from '@angular/forms';
import { FuiLabel } from '../../forms/common/label';
import { ControlReference } from '../../forms/common/control-reference';

export class FormControlClass {
  public static extractControlClass(
    control: NgControl,
    label?: FuiLabel,
    controlReference?: ControlReference
  ): Array<string> {
    const classes = [];
    if (control && control.touched) {
      classes.push('fui-touched');
    }
    if (control && control.dirty) {
      classes.push('fui-dirty');
    }
    if (control && control.disabled) {
      classes.push('fui-disabled');
    }
    if (control && control.pristine) {
      classes.push('fui-pristine');
    }
    if (control && !control.value) {
      classes.push('fui-empty');
    }
    if (!label) {
      classes.push('fui-no-label');
    }
    if (controlReference && controlReference.focus) {
      classes.push('fui-control-focus');
    }
    return classes;
  }
}
