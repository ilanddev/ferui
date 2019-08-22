import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <default-template-wrapper
        [pageTitle]="'Password Page'"
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
          <textarea fuiTextarea name="one" [(ngModel)]="model.one"></textarea>
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
          <fui-textarea-container>
            <textarea fuiTextarea name="two" [(ngModel)]="model.two"></textarea>
          </fui-textarea-container>
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
          <fui-textarea-container>
            <label for="three">Full example</label>
            <textarea
              placeholder="With placeholder"
              fuiTextarea
              id="three"
              name="three"
              [(ngModel)]="model.three"
              required
            ></textarea>
          </fui-textarea-container>
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
          <h5 #title>
            Label, wrapper, <span class="text-danger">required</span> validator but
            <span class="text-danger">disabled</span> :
          </h5>
          <fui-textarea-container>
            <label for="four">Full example (disabled)</label>
            <textarea fuiTextarea id="four" name="four" [(ngModel)]="model.four" required [disabled]="disabled"></textarea>
            <fui-control-error>This field is required</fui-control-error>
          </fui-textarea-container>
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
          <fui-textarea-container>
            <label for="five">Full example (disabled, filled)</label>
            <textarea fuiTextarea id="five" name="five" [(ngModel)]="model.five" required [disabled]="disabled"></textarea>
            <fui-control-error>This field is required</fui-control-error>
          </fui-textarea-container>
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
          <fui-textarea-container>
            <label for="six">Full example (multiple validators)</label>
            <textarea fuiTextarea id="six" name="six" [(ngModel)]="model.six" required email></textarea>
            <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
            <fui-control-error *fuiIfError="'email'">You didn't type an email address</fui-control-error>
          </fui-textarea-container>
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
export class TextareaComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: 'Filled with value',
    three: '',
    four:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet feugiat tristique. Nulla facilisi. Mauris id mauris hendrerit, rutrum arcu sit amet, porttitor nunc. Pellentesque volutpat porttitor ultrices. Nullam lorem felis, aliquet sit amet dui luctus, rutrum sollicitudin nisl. Etiam ligula felis, pellentesque a vulputate ut, fringilla nec tellus. Vivamus vitae dapibus massa, sed viverra arcu. Aenean semper mi a est molestie mattis. Phasellus fringilla nunc et metus aliquet, ac egestas eros pretium. Cras sed dapibus eros. Proin ultrices pellentesque ligula, et ornare sem auctor sed. Aliquam erat volutpat. Pellentesque volutpat scelerisque nunc, in mollis nunc ullamcorper et.',
    five: 'Disabled with value',
    six: '',
  };

  exampleCodes: Array<string> = [
    `<textarea fuiTextarea name="one" [(ngModel)]="model.one"></textarea>`,
    `<fui-textarea-container>
  <textarea fuiTextarea name="two" [(ngModel)]="model.two"></textarea>
</fui-textarea-container>`,
    `<fui-textarea-container>
  <label for="three">Full example</label>
  <textarea placeholder="With placeholder" fuiTextarea id="three" name="three" [(ngModel)]="model.three" required></textarea>
  <!-- All the validator messages are default ones -->
</fui-textarea-container>`,
    `<fui-textarea-container>
  <label for="four">Full example (disabled)</label>
  <textarea fuiTextarea id="four" name="four" [(ngModel)]="model.four" required [disabled]="disabled"></textarea>
  <fui-control-error>This field is required</fui-control-error>
</fui-textarea-container>`,
    `<fui-textarea-container>
  <label for="five">Full example (disabled, filled)</label>
  <textarea fuiTextarea id="five" name="five" [(ngModel)]="model.five" required [disabled]="disabled"></textarea>
  <fui-control-error>This field is required</fui-control-error>
</fui-textarea-container>`,
    `<fui-textarea-container>
  <label for="six">Full example (multiple validators)</label>
  <textarea fuiTextarea id="six" name="six" [(ngModel)]="model.six" required email></textarea>
  <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
  <fui-control-error *fuiIfError="'email'">You didn't type an email address</fui-control-error>
</fui-textarea-container>`,
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
