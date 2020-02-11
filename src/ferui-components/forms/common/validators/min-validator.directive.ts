import { AbstractControl } from '@angular/forms';
import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { Validator } from '@angular/forms';

@Directive({
  selector: '[min]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValidatorDirective, multi: true }]
})
export class MinValidatorDirective implements Validator {
  @Input() min: number;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return parseInt(control.value, 10) < this.min ? { min: true } : null;
  }
}
