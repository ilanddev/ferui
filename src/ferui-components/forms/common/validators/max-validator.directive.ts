import { AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { Validator } from '@angular/forms';

@Directive({
  selector: '[max]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValidatorDirective, multi: true }]
})
export class MaxValidatorDirective implements Validator {
  @Input() max: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return parseInt(control.value, 10) > this.max ? { max: true } : null;
  }
}
