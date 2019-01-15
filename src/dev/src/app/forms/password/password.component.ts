import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <default-template-wrapper [pageTitle]="'Password Page'" [(disabled)]="disabled" [examples]="examples"
                                [results]="results" (toggleEvent)="toggle($event)">

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[0]"
                                  [examples]="examples" [results]="results" [idx]="0" [resultModelNames]="'one'">
          <h5 #title>No label, wrapper :</h5>
          <fui-password-container>
            <input fuiPassword name="one" [(ngModel)]="model.one"/>
          </fui-password-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[1]"
                                  [examples]="examples" [results]="results" [idx]="1" [resultModelNames]="'two'">
          <h5 #title>Label, wrapper and <span class="text-danger">required</span> validator :</h5>
          <fui-password-container>
            <label>Full example</label>
            <input placeholder="With placeholder" fuiPassword name="two" [(ngModel)]="model.two" required/>
            <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
          </fui-password-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[2]"
                                  [examples]="examples" [results]="results" [idx]="2" [resultModelNames]="'three'">
          <h5 #title>Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span>
            :</h5>
          <fui-password-container>
            <label>Full example (disabled)</label>
            <input fuiPassword name="three" [(ngModel)]="model.three" required [disabled]="disabled"/>
            <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)
            </fui-control-error>
          </fui-password-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[3]"
                                  [examples]="examples" [results]="results" [idx]="3" [resultModelNames]="'four'">
          <h5 #title>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>
          <fui-password-container>
            <label>Full example (disabled, filled)</label>
            <input fuiPassword name="four" [(ngModel)]="model.four" required [disabled]="disabled"/>
            <!-- All the validator messages are default ones -->
          </fui-password-container>
        </default-template-content>
      </default-template-wrapper>
      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>`,
})
export class PasswordComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: '',
    three: '',
    four: 'Disabled with value',
  };

  exampleCodes: Array<string> = [
    `<fui-password-container>
  <input fuiPassword name="one" [(ngModel)]="model.one"/>
</fui-password-container>`,
    `<fui-password-container>
  <label>Full example</label>
  <input placeholder="With placeholder" fuiPassword name="two" [(ngModel)]="model.two" required/>
  <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
</fui-password-container>`,
    `<fui-password-container>
  <label>Full example (disabled)</label>
  <input fuiPassword name="three" [(ngModel)]="model.three" required [disabled]="disabled"/>
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
</fui-password-container>`,
    `<fui-password-container>
  <label>Full example (disabled, filled)</label>
  <input fuiPassword name="four" [(ngModel)]="model.four" required [disabled]="disabled"/>
  <!-- All the validator messages are default ones -->
</fui-password-container>`,
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    for (const idx in this.exampleCodes) {
      if (this.exampleCodes[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
      }
    }
  }
}
