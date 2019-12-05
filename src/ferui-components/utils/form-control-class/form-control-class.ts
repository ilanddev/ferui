import { NgControl } from '@angular/forms';
import { FuiLabel } from '../../forms/common/label';

export class FormControlClass {
  public static extractControlClass(
    control: NgControl,
    label?: FuiLabel,
    focus?: boolean,
    excludedList?: Array<string>
  ): Array<string> {
    const classes = [];
    if (!excludedList) {
      excludedList = [];
    }
    if (control && control.touched && excludedList.indexOf('fui-touched') === -1) {
      classes.push('fui-touched');
    }
    if (control && control.dirty && excludedList.indexOf('fui-dirty') === -1) {
      classes.push('fui-dirty');
    }
    if (control && control.disabled && excludedList.indexOf('fui-disabled') === -1) {
      classes.push('fui-disabled');
    }
    if (control && control.pristine && excludedList.indexOf('fui-pristine') === -1) {
      classes.push('fui-pristine');
    }
    if (control && !control.value && excludedList.indexOf('fui-empty') === -1) {
      classes.push('fui-empty');
    }
    if (!label && excludedList.indexOf('fui-no-label') === -1) {
      classes.push('fui-no-label');
    }
    if (focus && excludedList.indexOf('fui-control-focus') === -1) {
      classes.push('fui-control-focus');
    }
    return classes;
  }
}
