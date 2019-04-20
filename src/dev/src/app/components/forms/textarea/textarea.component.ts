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
            <demo-component [form]="demoForm" [componentData]="inputFive"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSix"></demo-component>
            <div class="footer">
              <button class="btn btn-primary" type="submit">
                Submit [disabled]="!demoForm.form.valid" (click)="promptSubmitInfos()"
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
      source: `<textarea #code fuiTextarea name="one" [(ngModel)]="models.one"></textarea>`,
    });
    this.inputTwo = new DemoComponentData({
      title: `<h5>No label, wrapper :</h5>`,
      models: { two: this.model.two },
      canDisable: false,
      source: `
        <fui-textarea-container #code>
          <textarea fuiTextarea name="two" [(ngModel)]="models.two"></textarea>
        </fui-textarea-container>`,
    });
    this.inputThree = new DemoComponentData({
      title: `<h5>Label, wrapper and <span class="text-danger">required</span> validator :</h5>`,
      models: { three: this.model.three },
      canDisable: false,
      source: `
        <fui-textarea-container #code>
          <label for="three">Full example</label>
          <textarea placeholder="With placeholder" fuiTextarea id="three" name="three" [(ngModel)]="models.three" required></textarea>
        </fui-textarea-container>`,
    });
    this.inputFour = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :</h5>`,
      models: { four: this.model.four },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-textarea-container #code>
          <label for="four">Full example (disabled)</label>
          <textarea fuiTextarea id="four" name="four" [(ngModel)]="models.four" required [disabled]="params.disabled"></textarea>
          <fui-control-error>This field is required</fui-control-error>
        </fui-textarea-container>`,
    });
    this.inputFive = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>`,
      models: { five: this.model.five },
      params: { disabled: this.disabled },
      canDisable: true,
      source: `
        <fui-textarea-container #code>
          <label for="five">Full example (disabled, filled)</label>
          <textarea fuiTextarea id="five" name="five" [(ngModel)]="models.five" required [disabled]="disabled"></textarea>
          <fui-control-error>This field is required</fui-control-error>
        </fui-textarea-container>`,
    });
    this.inputSix = new DemoComponentData({
      title: `<h5>Multiple validators</h5>`,
      models: { six: this.model.six },
      canDisable: false,
      source: `
        <fui-textarea-container #code>
          <label for="six">Full example (multiple validators)</label>
          <textarea fuiTextarea id="six" name="six" [(ngModel)]="models.six" required email></textarea>
          <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
          <fui-control-error *fuiIfError="'email'">You didn't type an email address</fui-control-error>
        </fui-textarea-container>`,
    });
  }
}
