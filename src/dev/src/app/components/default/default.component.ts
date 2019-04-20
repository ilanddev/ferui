import { AfterContentInit, AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DemoComponentData } from '../../utils/demo-component-data';
import { AbstractControlDemoComponent } from '../forms/abstract-control-demo.component';
import { NgForm } from '@angular/forms';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <demo-page pageTitle="Test demo component">
        <demo-component [form]="demoForm" [componentData]="testInput"></demo-component>
      </demo-page>
    </form>
    <div class="footer">
      <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
      <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
      <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
    </div>
  `,
})
export class ComponentsDashboardComponent implements OnInit {
  @ViewChild('demoForm') form: NgForm;

  testInput: DemoComponentData;

  ngOnInit(): void {
    this.testInput = new DemoComponentData({
      title: `<h5>Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :</h5>`,
      models: { one: 'one' },
      params: { value: 'value' },
      canDisable: true,
      source: `
          <fui-input-container #code>
            <label>Full example (disabled, filled)</label>
            <input fuiInput name="myField" [(ngModel)]="models.one" required [disabled]="params.disabled"/>
            <!-- All the validator messages are default ones -->
          </fui-input-container>`,
    });
  }

  validate(): void {
    this.form.form.markAsTouched();
    for (const controlKey in this.form.controls) {
      if (this.form.controls.hasOwnProperty(controlKey)) {
        this.form.controls[controlKey].markAsTouched();
        this.form.controls[controlKey].updateValueAndValidity();
      }
    }
  }
}
