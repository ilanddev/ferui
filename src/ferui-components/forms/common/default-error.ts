import { Component, Input } from '@angular/core';

@Component({
  selector: 'fui-default-control-error',
  template: `
    <ng-content></ng-content>
    <fui-control-error [displayOn]="condition" *fuiIfError="'ipv4Address'">This is not a valid IPV4-Address.</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'ipv6Address'">This is not a valid IPV6-Address.</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'ipAddress'">This is not a valid IP-Address.</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'required'">This field is required</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'email'">You didn't enter a valid email address</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'minLength'">String didn't reach the minimum</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'maxLength'">String is too long</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'min'">The number is less than minimum</fui-control-error>
    <fui-control-error [displayOn]="condition" *fuiIfError="'max'">The number is higher than the maximum</fui-control-error>
  `,
  host: { '[class.fui-subtext-wrapper]': 'true' },
})
export class FuiDefaultControlError {
  @Input('on') condition: boolean;
}
