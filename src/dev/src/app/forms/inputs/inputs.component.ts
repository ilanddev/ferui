import { Component } from '@angular/core';

@Component({
  templateUrl: './inputs.component.html',
})
export class InputsComponent {
  code1: string = `<input fuiInput name="one" [(ngModel)]="inputs.one"/>`;
  code2: string = `<fui-input-container>
  <input fuiInput name="two" [(ngModel)]="inputs.two"/>
</fui-input-container>`;
  code3: string = `<fui-input-container>
  <label>Full example</label>
  <input fuiInput name="three" [(ngModel)]="inputs.three" required/>
  <fui-control-error>There was an error</fui-control-error>
</fui-input-container>`;
  code4: string = `<fui-input-container>
  <label>Full example (disabled)</label>
  <input fuiInput name="four" [(ngModel)]="inputs.four" required [disabled]="disabled"/>
  <fui-control-error>This field is required</fui-control-error>
</fui-input-container>`;
  code5: string = `<fui-input-container>
  <label>Full example (disabled, filled)</label>
  <input fuiInput name="five" [(ngModel)]="inputs.five" required [disabled]="disabled"/>
  <fui-control-error>This field is required</fui-control-error>
</fui-input-container>`;
  code6: string = `<fui-input-container>
  <label>Full example</label>
  <input fuiInput name="six" [(ngModel)]="inputs.six" required email/>
  <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
  <fui-control-error *fuiIfError="'email'">You didn't type an email address</fui-control-error>
</fui-input-container>`;

  example1: boolean = false;
  example2: boolean = false;
  example3: boolean = false;
  example4: boolean = false;
  example5: boolean = false;
  example6: boolean = false;

  disabled = true;
  inputs = {
    one: '',
    two: 'Filled with value',
    three: '',
    four: '',
    five: 'Disabled with value',
    six: ''
  };

  toggleAllCodes(): void {
    this.example1 = !this.example1;
    this.example2 = !this.example2;
    this.example3 = !this.example3;
    this.example4 = !this.example4;
    this.example5 = !this.example5;
    this.example6 = !this.example6;
  }
}
