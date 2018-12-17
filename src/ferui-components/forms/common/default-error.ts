import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'fui-default-control-error',
  template: `
    <fui-control-error [on]="condition" *fuiIfError="'ipv4Address'">This is not a valid IPV4-Address.</fui-control-error>
    <fui-control-error [on]="condition" *fuiIfError="'ipv6Address'">This is not a valid IPV6-Address.</fui-control-error>
    <fui-control-error [on]="condition" *fuiIfError="'ipAddress'">This is not a valid IP-Address.</fui-control-error>
    <fui-control-error [on]="condition" *fuiIfError="'required'">This field is required</fui-control-error>
    <fui-control-error [on]="condition" *fuiIfError="'email'">You didn't enter a valid email address</fui-control-error>
    
  `,
  host: { '[class.fui-subtext-wrapper]': 'true' },
})
export class FuiDefaultControlError {
  @Input('on') condition: boolean;
}
