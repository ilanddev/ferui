import { Component, OnInit } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <default-template-wrapper
        [pageTitle]="'Input Page'"
        [(disabled)]="disabled"
        [examples]="examples"
        [results]="results"
        (toggleEvent)="toggle($event)"
      >
        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[0]"
          [examples]="examples"
          [results]="results"
          [idx]="0"
          [resultModelNames]="'one'"
        >
          <h5 #title>No label, no wrapper :</h5>
          <input fuiInput name="one" [(ngModel)]="model.one" />
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[1]"
          [examples]="examples"
          [results]="results"
          [idx]="1"
          [resultModelNames]="'two'"
        >
          <h5 #title>No label, wrapper :</h5>
          <fui-input-container>
            <input fuiInput name="two" [(ngModel)]="model.two" />
          </fui-input-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[2]"
          [examples]="examples"
          [results]="results"
          [idx]="2"
          [resultModelNames]="'three'"
        >
          <h5 #title>Label, wrapper and <span class="text-danger">required</span> validator :</h5>
          <fui-input-container>
            <label>Full example</label>
            <input placeholder="With placeholder" fuiInput name="three" [(ngModel)]="model.three" required />
            <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
          </fui-input-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[3]"
          [examples]="examples"
          [results]="results"
          [idx]="3"
          [resultModelNames]="'four'"
        >
          <h5>
            Label, wrapper, <span class="text-danger">required</span> validator but
            <span class="text-danger">disabled</span> :
          </h5>
          <fui-input-container>
            <label>Full example (disabled)</label>
            <input fuiInput name="four" [(ngModel)]="model.four" required [disabled]="disabled" />
            <fui-control-error *fuiIfError="'required'"
              >This field is required (this message overwrite any other ones)
            </fui-control-error>
          </fui-input-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[4]"
          [examples]="examples"
          [results]="results"
          [idx]="4"
          [resultModelNames]="'five'"
        >
          <h5 #title>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>
          <fui-input-container>
            <label>Full example (disabled, filled)</label>
            <input fuiInput name="five" [(ngModel)]="model.five" required [disabled]="disabled" />
            <!-- All the validator messages are default ones -->
          </fui-input-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[5]"
          [examples]="examples"
          [results]="results"
          [idx]="5"
          [resultModelNames]="'six'"
        >
          <h5 #title>Multiple validators</h5>
          <fui-input-container>
            <label>Full example (multiple validators)</label>
            <input fuiInput name="six" [(ngModel)]="model.six" required email />
            <!-- All the validator messages are default ones -->
          </fui-input-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[6]"
          [examples]="examples"
          [results]="results"
          [idx]="6"
          [resultModelNames]="'seven'"
        >
          <h5 #title>Custom IPV4Adress validator</h5>
          <fui-input-container>
            <label>Custom example (ipv4 validator)</label>
            <input fuiInput name="seven" [(ngModel)]="model.seven" required ipv4Address />
            <fui-control-error *fuiIfError="'required'"
              >This field is required (this message overwrite default require message)
            </fui-control-error>
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

  // We need to rewrite the code there to be able to pass it to the highlight directive.
  // Keep in mind that the order is important there !
  exampleCodes: Array<string> = [
    `<input fuiInput name="one" [(ngModel)]="model.one"/>`,
    `<fui-input-container>
  <input fuiInput name="two" [(ngModel)]="model.two"/>
</fui-input-container>`,
    `<fui-input-container>
  <label>Full example</label>
  <input placeholder="With placeholder" fuiInput name="three" [(ngModel)]="model.three" required/>
  <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
</fui-input-container>`,
    `<fui-input-container>
  <label>Full example (disabled)</label>
  <input fuiInput name="four" [(ngModel)]="model.four" required [disabled]="disabled"/>
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
</fui-input-container>`,
    `<fui-input-container>
  <label>Full example (disabled, filled)</label>
  <input fuiInput name="five" [(ngModel)]="model.five" required [disabled]="disabled"/>
  <!-- All the validator messages are default ones -->
</fui-input-container>`,
    `<fui-input-container>
  <label>Full example (multiple validators)</label>
  <input fuiInput name="six" [(ngModel)]="model.six" required email/>
  <!-- All the validator messages are default ones -->
</fui-input-container>`,
    `<fui-input-container>
  <label>Custom example (ipv4 validator)</label>
  <input fuiInput name="seven" [(ngModel)]="model.seven" required ipv4Address />
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite default require message)</fui-control-error>
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
