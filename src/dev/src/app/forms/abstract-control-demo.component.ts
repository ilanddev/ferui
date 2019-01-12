import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface ExampleCode {
  title: string;
  description?: string;
  code: string;
  resultModels: Array<string>;
}

export abstract class AbstractControlDemoComponent {
  protected defaultExampleValue: boolean = true;
  protected defaultResultValue: boolean = true;

  examplesCode: Array<string> = [];
  examples: any = {};
  results: any = {};
  disabled: boolean = true;

  @ViewChild('demoForm') form: NgForm;

  protected constructor() {}

  concatResultModels(models, ...modelNames): Array<any> {
    const results: Array<any> = [];
    for (const name of modelNames) {
      results.push({
        'field-name': name,
        value: models[name],
      });
    }
    return results;
  }

  toggle(tgl: Array<any>): void {
    const model: any = tgl[0];
    const index: number | string = tgl[1];
    if (model[index] !== undefined) {
      model[index] = !model[index];
    }
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
