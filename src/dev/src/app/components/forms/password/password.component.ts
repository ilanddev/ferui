import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { DemoComponentData } from '../../../utils/demo-component-data';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [title]="'Examples'" [active]="true">
          <demo-page [filtersDisplayed]="true" pageTitle="Password component">
            <demo-component [form]="demoForm" [componentData]="inputOne"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputTwo"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputThree"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFour"></demo-component>
          </demo-page>
        </fui-tab>
        <fui-tab [title]="'Documentation'">
          <div class="row">
            <p>In construction...</p>
          </div>
        </fui-tab>
      </fui-tabs>
      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" (click)="promptSubmitInfos()" type="submit">
          Submit
        </button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>
  `,
})
export class PasswordComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: '',
    three: '',
    four: 'Disabled with value',
  };

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inputOne = new DemoComponentData({
      title: `<h5>No label, wrapper :</h5>`,
      models: { one: this.model.one },
      canDisable: false,
      source: `
        <fui-password-container #code>
          <input fuiPassword name="one" [(ngModel)]="models.one" />
        </fui-password-container>`,
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: { two: this.model.two },
      canDisable: false,
      source: `
        <fui-password-container #code>
          <label>Full example</label>
          <input placeholder="With placeholder" fuiPassword name="two" [(ngModel)]="models.two" required />
          <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
        </fui-password-container>`,
    });

    this.inputThree = new DemoComponentData({
      title: `<h5> Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :</h5>`,
      models: { three: this.model.three },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-password-container #code>
          <label>Full example (disabled)</label>
          <input fuiPassword name="three" [(ngModel)]="models.three" required [disabled]="params.disabled" />
          <fui-control-error *fuiIfError="'required'">
            This field is required (this message overwrite any other ones)
          </fui-control-error>
        </fui-password-container>`,
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>`,
      models: { four: this.model.four },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-password-container>
          <label>Full example (disabled, filled)</label>
          <input fuiPassword name="four" [(ngModel)]="models.four" required [disabled]="params.disabled"/>
          <!-- All the validator messages are default ones -->
        </fui-password-container>`,
    });
  }
}
