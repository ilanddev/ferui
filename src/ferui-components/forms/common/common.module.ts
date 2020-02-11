import { FuiForm } from './form';
import { CommonModule } from '@angular/common';
import { FuiControlError } from './error';
import { FuiIfError } from './if-error/if-error';
import { FuiLabel } from './label';
import { NgModule } from '@angular/core';
import { FuiHostWrappingModule } from '../../utils/host-wrapping/host-wrapping.module';
import { FuiDefaultControlError } from './default-error';
import { Ipv4AddressValidatorDirective } from './validators/ipv4-address-validator.directive';
import { Ipv6AddressValidatorDirective } from './validators/ipv6-address-validator.directive';
import { IpAddressValidatorDirective } from './validators/ip-address-validator.directive';
import { EmailValidatorDirective } from './validators/email-validator';
import { MaxValidatorDirective } from './validators/max-validator.directive';
import { MinValidatorDirective } from './validators/min-validator.directive';

@NgModule({
  imports: [CommonModule, FuiHostWrappingModule],
  declarations: [
    EmailValidatorDirective,
    IpAddressValidatorDirective,
    Ipv4AddressValidatorDirective,
    Ipv6AddressValidatorDirective,
    MaxValidatorDirective,
    MinValidatorDirective,
    FuiLabel,
    FuiControlError,
    FuiDefaultControlError,
    FuiIfError,
    FuiForm
  ],
  exports: [
    EmailValidatorDirective,
    IpAddressValidatorDirective,
    Ipv4AddressValidatorDirective,
    Ipv6AddressValidatorDirective,
    MaxValidatorDirective,
    MinValidatorDirective,
    FuiLabel,
    FuiControlError,
    FuiDefaultControlError,
    FuiIfError,
    FuiForm
  ]
})
export class FuiCommonFormsModule {}
