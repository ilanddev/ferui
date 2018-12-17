import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { Validator } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // We let another validator taking care of empty values
    if (!control.value) {
      return null;
    }
    // tslint:disable-next-line
    const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+[.][A-Za-z0-9]+$/;
    const email = emailRegEx.test(control.value);
    return !email ? { email: { value: control.value } } : null;
  };
}

@Directive({
  selector: '[email]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }],
})
export class EmailValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return emailValidator()(control);
  }
}
