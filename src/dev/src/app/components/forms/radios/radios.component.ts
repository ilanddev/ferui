import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
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
export class RadiosComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    twobis: '',
    three: 'option2',
    four: 'yes',
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
      title: `<h5>No label, no wrapper :</h5>`,
      models: {
        one: this.model.one,
      },
      canDisable: false,
      source: `<input #code type="radio" value="yes" fuiRadio name="one" [(ngModel)]="models.one" />`,
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>Radio with label :</h5>`,
      models: {
        two: this.model.two,
        twobis: this.model.twobis,
      },
      canDisable: false,
      source: `
        <fui-radio-wrapper class="code">
          <input type="radio" fuiRadio name="two" value="yes" [(ngModel)]="models.two" />
          <label>Option 1</label>
        </fui-radio-wrapper>
        <fui-radio-wrapper class="code">
          <input type="radio" fuiRadio name="twobis" value="yes" [(ngModel)]="models.twobis" />
          <label>Option 2</label>
        </fui-radio-wrapper>`,
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: {
        three: this.model.three,
      },
      canDisable: false,
      source: `
        <fui-radio-container class="code">
          <fui-radio-wrapper>
            <input type="radio" fuiRadio name="option" required value="option1" [(ngModel)]="models.three" />
            <label>Option 1</label>
          </fui-radio-wrapper>
          <fui-radio-wrapper class="code">
            <input type="radio" fuiRadio name="option" required value="option2" [(ngModel)]="models.three" />
            <label>Option 2</label>
          </fui-radio-wrapper>
          <fui-control-error>This field is required!</fui-control-error>
        </fui-radio-container>`,
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Radio with label (disabled) :</h5>`,
      models: {
        four: this.model.four,
      },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
      <fui-radio-wrapper class="code">
        <input type="radio" [disabled]="params.disabled" fuiRadio name="four" value="yes" [(ngModel)]="models.four" />
        <label>Option 1</label>
      </fui-radio-wrapper>
      <fui-radio-wrapper class="code">
        <input type="radio" [disabled]="params.disabled" fuiRadio name="four" value="no" [(ngModel)]="models.four" />
        <label>Option 2</label>
      </fui-radio-wrapper>`,
    });
  }
}
