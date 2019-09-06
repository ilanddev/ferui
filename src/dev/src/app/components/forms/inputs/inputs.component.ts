import { Component, OnInit } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { DemoComponentData } from '../../../utils/demo-component-data';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [title]="'Examples'" [active]="true">
          <demo-page [filtersDisplayed]="true" pageTitle="Input component">
            <demo-component [form]="demoForm" [componentData]="inputOne"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputTwo"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputThree"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFour"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFive"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSix"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSeven"></demo-component>
            <div class="footer">
              <button
                class="btn btn-primary"
                [disabled]="!demoForm.form.valid"
                (click)="promptSubmitInfos()"
                type="submit"
              >
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
  `,
})
export class InputsComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: 'Filled with value',
    three: '',
    four: '',
    five: 'Disabled with value',
    six: '',
    seven: '',
  };

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;
  inputFive: DemoComponentData;
  inputSix: DemoComponentData;
  inputSeven: DemoComponentData;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inputOne = new DemoComponentData({
      title: `<h5>No label, no wrapper :</h5>`,
      models: { one: this.model.one },
      canDisable: false,
      source: `<input #code fuiInput name="one" [(ngModel)]="models.one"/>`,
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>No label, wrapper :</h5>`,
      models: { two: this.model.two },
      canDisable: false,
      source: `
        <fui-input-container #code>
          <input fuiInput name="two" [(ngModel)]="models.two"/>
        </fui-input-container>`,
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: { three: this.model.three },
      canDisable: false,
      source: `
        <fui-input-container #code>
          <label>Full example</label>
          <input placeholder="With placeholder" fuiInput name="three" [(ngModel)]="models.three" required/>
          <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
        </fui-input-container>`,
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator but<span class="text-danger">disabled</span> :</h5>`,
      models: { four: this.model.four },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-input-container #code>
          <label>Full example (disabled)</label>
          <input fuiInput name="four" [(ngModel)]="models.four" required [disabled]="params.disabled"/>
          <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
        </fui-input-container>`,
    });

    this.inputFive = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>`,
      models: { five: this.model.five },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-input-container #code>
          <label>Full example (disabled, filled)</label>
          <input fuiInput name="five" [(ngModel)]="models.five" required [disabled]="params.disabled"/>
          <!-- All the validator messages are default ones -->
        </fui-input-container>`,
    });

    this.inputSix = new DemoComponentData({
      title: `<h5 #title>Multiple validators</h5>`,
      models: { six: this.model.six },
      canDisable: false,
      source: `
        <fui-input-container #code>
          <label>Full example (multiple validators)</label>
          <input fuiInput name="six" [(ngModel)]="models.six" required email/>
          <!-- All the validator messages are default ones -->
        </fui-input-container>`,
    });

    this.inputSeven = new DemoComponentData({
      title: `<h5 #title>Custom IPV4Adress validator</h5>`,
      models: { seven: this.model.seven },
      canDisable: false,
      source: `
        <fui-input-container #code>
          <label>Custom example (ipv4 validator)</label>
          <input fuiInput name="seven" [(ngModel)]="models.seven" required ipv4Address/>
          <fui-control-error *fuiIfError="'required'">
            This field is required (this message overwrite default require message)
          </fui-control-error>
        </fui-input-container>`,
    });
  }
}
