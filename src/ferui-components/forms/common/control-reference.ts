import { HostBinding } from '@angular/core';
import { Input } from '@angular/core';
import { HostListener } from '@angular/core';

export interface ControlReferenceInterface {
  focus: boolean;
  required: boolean;
}
export class ControlReference implements ControlReferenceInterface {
  focus: boolean = false;

  @HostBinding('attr.required')
  @Input('required')
  required: boolean;

  @HostListener('focus')
  OnFocus() {
    this.focus = true;
  }

  @HostListener('blur')
  OnBlur() {
    this.focus = false;
  }
}
