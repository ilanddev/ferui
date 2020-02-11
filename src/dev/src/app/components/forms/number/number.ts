import { Component, OnInit } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { DemoComponentData } from '../../../utils/demo-component-data';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [title]="'Examples'" [active]="true">
          <demo-page [filtersDisplayed]="true" pageTitle="Input Number component">
            <demo-component [form]="demoForm" [componentData]="inputOne"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputTwo"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputThree"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFour"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFive"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSix"></demo-component>
            <div class="footer">
              <button class="btn btn-primary" [disabled]="!demoForm.form.valid" (click)="promptSubmitInfos()" type="submit">
                Submit
              </button>
              <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
              <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
            </div>
          </demo-page>
        </fui-tab>
        <fui-tab [title]="'Documentation'">
          <div class="row">
            <p>In construction...</p>
          </div>
        </fui-tab>
      </fui-tabs>
    </form>
  `
})
export class NumberComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: null,
    two: null,
    three: null,
    four: 10,
    five: 100,
    six: null
  };

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;
  inputFive: DemoComponentData;
  inputSix: DemoComponentData;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inputOne = new DemoComponentData({
      title: `<h5>No label, no wrapper :</h5>`,
      models: { one: this.model.one },
      canDisable: false,
      source: `<input #code fuiNumber name="one" [(ngModel)]="models.one"/>`
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>No label, wrapper :</h5>`,
      models: { one: this.model.one },
      canDisable: false,
      source: `<fui-number-container #code>
          <input fuiNumber name="two" [(ngModel)]="models.two"/>
        </fui-number-container>`
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: { three: this.model.three },
      canDisable: false,
      source: `
        <fui-number-container #code>
          <label>Full example</label>
          <input placeholder="With placeholder" type="number" [step]="10" [min]="0" [max]="100" fuiNumber name="three" [(ngModel)]="models.three" required/>
          <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
        </fui-number-container>`
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :</h5>`,
      models: { four: this.model.four },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-number-container #code>
          <label>Full example (disabled)</label>
          <input fuiNumber name="four" [(ngModel)]="models.four" required [disabled]="params.disabled"/>
          <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
        </fui-number-container>`
    });

    this.inputFive = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>`,
      models: { five: this.model.five },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-number-container #code>
          <label>Full example (disabled, filled)</label>
          <input fuiNumber name="five" [(ngModel)]="models.five" required [disabled]="params.disabled"/>
          <!-- All the validator messages are default ones -->
        </fui-number-container>`
    });

    this.inputSix = new DemoComponentData({
      title: `<h5 #title>Multiple validators</h5>`,
      models: { six: this.model.six },
      canDisable: false,
      source: `
        <fui-number-container #code>
          <label>Full example (multiple validators)</label>
          <input fuiNumber name="six" [(ngModel)]="models.six" required [min]="1" [max]="20"/>
          <!-- All the validator messages are default ones -->
        </fui-number-container>`
    });
  }
}
