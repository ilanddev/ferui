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
          <h5 #title>No label, no wrapper :</h5>
          <input type="radio" value="yes" fuiRadio name="one" [(ngModel)]="model.one"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[1]"
                                  [examples]="examples" [results]="results" [idx]="1" [resultModelNames]="['two', 'twobis']">
          <h5 #title>Radio with label :</h5>
          <fui-radio-wrapper>
            <input type="radio" fuiRadio name="two" value="yes" [(ngModel)]="model.two"/>
            <label>Option 1</label>
          </fui-radio-wrapper>
          <fui-radio-wrapper>
            <input type="radio" fuiRadio name="twobis" value="yes" [(ngModel)]="model.twobis"/>
            <label>Option 2</label>
          </fui-radio-wrapper>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[2]"
                                  [examples]="examples" [results]="results" [idx]="2" [resultModelNames]="'three'">
          <h5 #title>Label, wrapper and <span class="text-danger">required</span> validator :</h5>
          <fui-radio-container>
            <fui-radio-wrapper>
              <input type="radio" fuiRadio name="option" required value="option1" [(ngModel)]="model.three" />
              <label>Option 1</label>
            </fui-radio-wrapper>
            <fui-radio-wrapper>
              <input type="radio" fuiRadio name="option" required value="option2" [(ngModel)]="model.three" />
              <label>Option 2</label>
            </fui-radio-wrapper>
            <fui-control-error>This field is required!</fui-control-error>
          </fui-radio-container>
        </default-template-content>
        
      </default-template-wrapper>
      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>`,
})
export class RadiosComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    twobis: '',
    three: 'option2',
  };

  exampleCodes: Array<string> = [
    `<input type="radio" value="yes" fuiRadio name="one" [(ngModel)]="model.one"/>`,
    `<fui-radio-wrapper>
  <input type="radio" fuiRadio name="two" value="yes" [(ngModel)]="model.two"/>
  <label>Option 1</label>
</fui-radio-wrapper>
<fui-radio-wrapper>
  <input type="radio" fuiRadio name="twobis" value="yes" [(ngModel)]="model.twobis"/>
  <label>Option 2</label>
</fui-radio-wrapper>`,
    `<fui-radio-container>
  <fui-radio-wrapper>
    <input type="radio" fuiRadio name="option" required value="option1" [(ngModel)]="model.three" />
    <label>Option 1</label>
  </fui-radio-wrapper>
  <fui-radio-wrapper>
    <input type="radio" fuiRadio name="option" required value="option2" [(ngModel)]="model.three" />
    <label>Option 2</label>
  </fui-radio-wrapper>
  <fui-control-error>This field is required!</fui-control-error>
</fui-radio-container>`,
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
