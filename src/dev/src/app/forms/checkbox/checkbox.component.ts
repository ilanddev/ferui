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
          <input type="checkbox" fuiCheckbox name="one" [(ngModel)]="model.one"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[1]"
                                  [examples]="examples" [results]="results" [idx]="1"
                                  [resultModelNames]="['two', 'twobis']">
          <h5 #title>Checkbox with label :</h5>
          <fui-checkbox-wrapper>
            <input type="checkbox" fuiCheckbox name="two" [(ngModel)]="model.two"/>
            <label>Option 1</label>
          </fui-checkbox-wrapper>
          <fui-checkbox-wrapper>
            <input type="checkbox" fuiCheckbox name="twobis" [(ngModel)]="model.twobis"/>
            <label>Option 2</label>
          </fui-checkbox-wrapper>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[2]"
                                  [examples]="examples" [results]="results" [idx]="2"
                                  [resultModelNames]="['three', 'threebis']">
          <h5 #title>Label, wrapper and <span class="text-danger">required</span> validator :</h5>
          <fui-checkbox-wrapper>
            <input type="checkbox" fuiCheckbox name="three" [(ngModel)]="model.three"/>
            <label>Option 1</label>
          </fui-checkbox-wrapper>
          <fui-checkbox-container>
            <fui-checkbox-wrapper>
              <input type="checkbox" fuiCheckbox name="threebis" required [(ngModel)]="model.threebis"/>
              <label>Option 2</label>
            </fui-checkbox-wrapper>
            <fui-control-error>This field is required!</fui-control-error>
          </fui-checkbox-container>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[3]"
                                  [examples]="examples" [results]="results" [idx]="3"
                                  [resultModelNames]="['four', 'fourbis']">
          <h5 #title>Checkboxes disabled</h5>
          <fui-checkbox-wrapper>
            <input type="checkbox" [disabled]="disabled" fuiCheckbox name="four" [(ngModel)]="model.four"/>
            <label>Option 1</label>
          </fui-checkbox-wrapper>
          <fui-checkbox-container>
            <fui-checkbox-wrapper>
              <input type="checkbox" [disabled]="disabled" fuiCheckbox name="fourbis" [(ngModel)]="model.fourbis"/>
              <label>Option 2</label>
            </fui-checkbox-wrapper>
          </fui-checkbox-container>
        </default-template-content>

      </default-template-wrapper>
      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>`,
})
export class CheckboxComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    twobis: '',
    three: false,
    threebis: null,
    four: '',
    fourbis: true,
  };

  exampleCodes: Array<string> = [
    `<input type="checkbox" fuiCheckbox name="one" [(ngModel)]="model.one"/>`,
    `<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="two" [(ngModel)]="model.two"/>
  <label>Option 1</label>
</fui-checkbox-wrapper>
<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="twobis" [(ngModel)]="model.twobis"/>
  <label>Option 2</label>
</fui-checkbox-wrapper>`,
    `<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="option1" value="option1" [(ngModel)]="model.three" />
  <label>Option 1</label>
</fui-checkbox-wrapper>
<fui-checkbox-container>
  <fui-checkbox-wrapper>
    <input type="checkbox" fuiCheckbox name="option2" required value="option2" [(ngModel)]="model.threebis" />
    <label>Option 2</label>
  </fui-checkbox-wrapper>
  <fui-control-error>This field is required!</fui-control-error>
</fui-checkbox-container>`,
    `<fui-checkbox-wrapper>
  <input type="checkbox" [disabled]="disabled" fuiCheckbox name="four" [(ngModel)]="model.four"/>
  <label>Option 1</label>
</fui-checkbox-wrapper>
<fui-checkbox-container>
  <fui-checkbox-wrapper>
    <input type="checkbox" [disabled]="disabled" fuiCheckbox name="fourbis" [(ngModel)]="model.fourbis"/>
    <label>Option 2</label>
  </fui-checkbox-wrapper>
</fui-checkbox-container>`,
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
