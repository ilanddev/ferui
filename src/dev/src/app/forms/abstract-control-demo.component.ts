import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface ControlTemplateInterface {
  template: string;

  getExamples(): Array<ExampleCode>;
}

export interface ExampleCode {
  title: string;
  description?: string;
  code: string;
  resultModels: Array<string>;
}

export abstract class AbstractControlTemplate implements ControlTemplateInterface {
  private _template: string;

  protected examplesCode: Array<ExampleCode> = [];

  protected constructor(private pageTitle: string = 'Control Page') {}

  protected init(): void {
    const startTag = `
      <h2 class="mt-2 mb-2">${this.pageTitle}</h2>
      <p class="mt-4">Filters :
        <button class="btn btn-sm btn-info" (click)="disabled = !disabled">Toggle Disabled</button>
        <button class="btn btn-sm btn-info ml-2" (click)="toggleAllCodes()">Toggle all code</button>
        <button class="btn btn-sm btn-info ml-2" (click)="toggleAllResults()">Toggle all results</button>
      </p>
      <form fuiForm class="container-fluid" #demoForm="ngForm">`;
    const endTag = `<div class="footer"><button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
  <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
  <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button></div>
</form>`;

    let block = ``;
    let idx = 0;
    for (const example of this.examplesCode) {
      block += `
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
              <h5 class="mt-3">${example.title}</h5>
              ${example.description ? '<p>' + example.description + '</p>' : ''}
              ${example.code}
            </div>
          </div>
          <div class="row pt-3" *ngIf="examplesCode[${idx}] !== ''">
            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
              <p>Result (<button class="btn btn-link p-0" (click)="toggle(results, ${idx})">{{ results[${idx}] ? 'Hide Results' : 'View Results'}}</button>)</p>
              <pre *ngIf="results[${idx}]"><code [highlight]="concatResultModels(model, ${
        example.resultModels.length > 0 ? example.resultModels.map(e => "'" + e + "'").join(', ') : '[]'
      }) | json"></code></pre>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
              <p>Code (<button class="btn btn-link p-0" (click)="toggle(examples, ${idx})">{{ examples[${idx}] ? 'Hide code' : 'View code'}}</button>)</p>
              <pre *ngIf="examples[${idx}]"><code [highlight]="examplesCode[${idx}]"></code></pre>
            </div>
          </div>
        </div>
      </div>`;
      idx++;
    }
    this.template = startTag + block + endTag;
  }

  public get template(): string {
    return this._template;
  }

  public set template(tplt: string) {
    this._template = tplt;
  }

  public getExamples(): Array<ExampleCode> {
    return this.examplesCode;
  }
}

export abstract class AbstractControlDemoComponent {
  protected defaultExampleValue: boolean = true;
  protected defaultResultValue: boolean = true;

  public examplesCode: Array<string> = [];
  public examples: any = {};
  public results: any = {};
  public disabled: boolean = true;

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

  toggle(model: any, index: number | string): void {
    if (model[index] !== undefined) {
      model[index] = !model[index];
    }
  }

  toggleAllCodes(): void {
    for (const ex in this.examples) {
      if (this.examples.hasOwnProperty(ex)) {
        this.toggle(this.examples, ex);
      }
    }
  }

  toggleAllResults(): void {
    for (const res in this.results) {
      if (this.results.hasOwnProperty(res)) {
        this.toggle(this.results, res);
      }
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
