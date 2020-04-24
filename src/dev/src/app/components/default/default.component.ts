import { Component, OnInit, ViewChild } from '@angular/core';
import { DemoComponentData } from '../../utils/demo-component-data';
import { NgForm } from '@angular/forms';

@Component({
  template: `
    <h1 class="mt-4">FerUI Components</h1>
    <hr />
    <h2 class="mt-3">Overview</h2>
    <p>
      <b>FerUI</b> stand for : <b>F</b>ast <b>E</b>asy <b>R</b>eusable <b>UI</b> and <i>Fer</i> sounds like <i>Fair</i> which is
      what we expect from a UI/UX web framework 😃. <br /><br />
      The Ferui project is an open sourced design system inspired from the amazing
      <a target="_blank" href="https://github.com/vmware/clarity/">Clarity</a> project that brings together UX guidelines, an
      HTML/CSS framework, and Angular components.
    </p>
    <p>
      Follow the <a href="https://github.com/ilanddev/ferui/blob/master/README.md" target="_blank">our github</a> for more infos.
    </p>
  `
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
          </fui-input-container>`
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
