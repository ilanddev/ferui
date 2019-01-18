import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';

const date1: Date = new Date();

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <default-template-wrapper [pageTitle]="'Input Page'" [(disabled)]="disabled" [examples]="examples"
                                [results]="results" (toggleEvent)="toggle($event)">

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[0]"
                                  [examples]="examples" [results]="results" [idx]="0" [resultModelNames]="'one'">
          <h5 #title>No label, no wrapper :</h5>
          <input fuiInput name="one" [(ngModel)]="model.one"/>
        </default-template-content>

        <default-template-content [disabled]="disabled" [model]="model" [code]="exampleCodes[1]"
                                  [examples]="examples" [results]="results" [idx]="1" [resultModelNames]="'two'">
          <h5 #title>No label, wrapper :</h5>
          <fui-input-container>
            <input fuiInput name="two" [(ngModel)]="model.two"/>
          </fui-input-container>
        </default-template-content>

      </default-template-wrapper>
      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>
  `,
})
export class DatetimeComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: date1,
    two: date1.toDateString(),
    three: '',
    four: '',
    five: 'Disabled with value',
    six: '',
    seven: '',
  };

  // We need to rewrite the code there to be able to pass it to the highlight directive.
  // Keep in mind that the order is important there !
  exampleCodes: Array<string> = [
    `<input fuiInput name="one" [(ngModel)]="model.one"/>`,
    `<fui-input-container>
  <input fuiInput name="two" [(ngModel)]="model.two"/>
</fui-input-container>`,
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
