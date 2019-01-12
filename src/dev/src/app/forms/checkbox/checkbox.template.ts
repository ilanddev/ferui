import { ExampleCode } from '../abstract-control-demo.component';

const examplesCode: Array<ExampleCode> = [
  {
    title: 'No label, no wrapper :',
    code: `<input type="checkbox" fuiCheckbox name="one" [(ngModel)]="model.one"/>`,
    resultModels: ['one'],
  },
  {
    title: 'Checkbox with label :',
    code: `<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="two" [(ngModel)]="model.two"/>
  <label>Option 1</label>
</fui-checkbox-wrapper>
<fui-checkbox-wrapper>
  <input type="checkbox" fuiCheckbox name="twobis" [(ngModel)]="model.twobis"/>
  <label>Option 2</label>
</fui-checkbox-wrapper>`,
    resultModels: ['two', 'twobis'],
  },
  {
    title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
    code: `<fui-checkbox-wrapper>
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
    resultModels: ['three', 'threebis'],
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
tplt = `<default-template-wrapper [pageTitle]="'Checkbox Page'" [(disabled)]="disabled" [examples]="examples" 
[results]="results" (toggleEvent)="toggle($event)">${tplt}</default-template-wrapper>`;

// Export constants.
export const CHECKBOX_EXAMPLES: Array<ExampleCode> = examplesCode;
export const CHECKBOX_TEMPLATE: string = tplt;
