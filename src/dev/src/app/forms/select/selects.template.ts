import { ExampleCode } from '../abstract-control-demo.component';

const examplesCode: Array<ExampleCode> = [
  {
    title: 'Basic knowledge',
    description: `Our selects are a little bit different than our other components. We decided to rely on a powerful, fully-featured 3rd Party <code>ng-select</code> component. For more information about <code>ng-select</code> we invite you to follow <a href="https://ng-select.github.io/ng-select#/" target="_blank">their documentation</a>.<br /> We've just added our custom error message handler and design.`,
    code: ``,
    resultModels: [],
  },
  {
    title: 'Basic example (without error handling)',
    code: `<ng-select fuiSelect name="city" [items]="defaultBindingsList"
  [(ngModel)]="model.selectedCity">
</ng-select>`,
    resultModels: ['selectedCity'],
  },
  {
    title: 'Basic example (including error handling)',
    code: `<fui-select-container>
  <label>Country</label>
  <ng-select fuiSelect name="country" [items]="countries"
     bindLabel="nested.name"
     bindValue="nested.countryId"
     placeholder="Select value"
     [(ngModel)]="model.selectedCountryId"
     required>
  </ng-select>
</fui-select-container>`,
    resultModels: ['selectedCountryId'],
  },
  {
    title: 'Using native select',
    description: `If for any reason you want to use a native selector, you can ! But be aware that you will miss all the awesomeness of ng-select though ;-)`,
    code: ``,
    resultModels: [],
  },
  {
    title: "Native select support (doesn't use ng-select library)",
    code: `<fui-select-container>
  <label>City</label>
  <select placeholder="Please select a city" fuiSelect required name="cityNative" [(ngModel)]="model.selectedCityNative">
    <option *ngFor="let city of cities" [disabled]="city.disabled" [ngValue]="city">{{city.name}}</option>
  </select>
</fui-select-container>`,
    resultModels: ['selectedCityNative'],
  },
];

let tplt: string = `<form fuiForm class="container-fluid" #demoForm="ngForm">`;
let idx = 0;
for (const example of examplesCode) {
  tplt += `
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
              <h5 class="mt-3">${example.title} (disabled ? {{disabled ? 'true' : 'false'}})</h5>
              ${example.description ? '<p>' + example.description + '</p>' : ''}
              ${example.code}
            </div>
          </div>
          <div class="row pt-3" *ngIf="examplesCode[${idx}] !== ''">
            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
              <p>Result (<button class="btn btn-link p-0" (click)="toggle([results, ${idx}])">{{ results[${idx}] ? 'Hide Results' : 'View Results'}}</button>)</p>
              <pre *ngIf="results[${idx}]"><code [highlight]="concatResultModels(model, ${
    example.resultModels.length > 0 ? example.resultModels.map(e => "'" + e + "'").join(', ') : '[]'
  }) | json"></code></pre>
            </div>
            <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
              <p>Code (<button class="btn btn-link p-0" (click)="toggle([examples, ${idx}])">{{ examples[${idx}] ? 'Hide code' : 'View code'}}</button>)</p>
              <pre *ngIf="examples[${idx}]"><code [highlight]="examplesCode[${idx}]"></code></pre>
            </div>
          </div>
        </div>
      </div>`;
  idx++;
}
tplt += `<div class="footer">
    <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
    <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
    <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
  </div>
</form>`;
tplt = `<default-template-wrapper [pageTitle]="'Selects Page'" [(disabled)]="disabled" [examples]="examples" 
[results]="results" (toggleEvent)="toggle($event)">${tplt}</default-template-wrapper>`;

// Export constants.
export const SELECTS_EXAMPLES: Array<ExampleCode> = examplesCode;
export const SELECTS_TEMPLATE: string = tplt;
