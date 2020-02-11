import { ValidatorFn } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Directive } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { Validator } from '@angular/forms';

export function ipv6AddressValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // We let another validator taking care of empty values
    if (!control.value) {
      return null;
    }
    // tslint:disable-next-line
    const ipV6RegEx = /^((([0–9A-Fa-f]{1,4}:){7}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){6}:[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){5}:([0–9A-Fa-f]{1,4}:)?[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){4}:([0–9A-Fa-f]{1,4}:){0,2}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){3}:([0–9A-Fa-f]{1,4}:){0,3}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){2}:([0–9A-Fa-f]{1,4}:){0,4}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){6}((b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b).){3}(b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b))|(([0–9A-Fa-f]{1,4}:){0,5}:((b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b).){3}(b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b))|(::([0–9A-Fa-f]{1,4}:){0,5}((b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b).){3}(b((25[0–5])|(1d{2})|(2[0–4]d)|(d{1,2}))b))|([0–9A-Fa-f]{1,4}::([0–9A-Fa-f]{1,4}:){0,5}[0–9A-Fa-f]{1,4})|(::([0–9A-Fa-f]{1,4}:){0,6}[0–9A-Fa-f]{1,4})|(([0–9A-Fa-f]{1,4}:){1,7}:))$/;
    const ipAddress = ipV6RegEx.test(control.value);
    return !ipAddress ? { ipv6Address: { value: control.value } } : null;
  };
}

@Directive({
  selector: '[ipv6Address]',
  providers: [{ provide: NG_VALIDATORS, useExisting: Ipv6AddressValidatorDirective, multi: true }]
})
export class Ipv6AddressValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    return ipv6AddressValidator()(control);
  }
}
