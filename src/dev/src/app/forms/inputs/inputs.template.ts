import { ExampleCode } from '../abstract-control-demo.component';

const examplesCode: Array<ExampleCode> = [
  {
    title: 'No label, no wrapper :',
    code: `<input fuiInput name="one" [(ngModel)]="model.one"/>`,
    resultModels: ['one'],
  },
  {
    title: 'No label, wrapper :',
    code: `<fui-input-container>
  <input fuiInput name="two" [(ngModel)]="model.two"/>
</fui-input-container>`,
    resultModels: ['two'],
  },
  {
    title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
    code: `<fui-input-container>
  <label>Full example</label>
  <input placeholder="With placeholder" fuiInput name="three" [(ngModel)]="model.three" required/>
  <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
</fui-input-container>`,
    resultModels: ['three'],
  },
  {
    title:
      'Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :',
    code: `<fui-input-container>
  <label>Full example (disabled)</label>
  <input fuiInput name="four" [(ngModel)]="model.four" required [disabled]="disabled"/>
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite any other ones)</fui-control-error>
</fui-input-container>`,
    resultModels: ['four'],
  },
  {
    title: 'Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :',
    code: `<fui-input-container>
  <label>Full example (disabled, filled)</label>
  <input fuiInput name="five" [(ngModel)]="model.five" required [disabled]="disabled"/>
  <!-- All the validator messages are default ones -->
</fui-input-container>`,
    resultModels: ['five'],
  },
  {
    title: 'Multiple validators',
    code: `<fui-input-container>
  <label>Full example (multiple validators)</label>
  <input fuiInput name="six" [(ngModel)]="model.six" required email/>
  <!-- All the validator messages are default ones -->
</fui-input-container>`,
    resultModels: ['six'],
  },
  {
    title: 'Custom IPV4Adress validator',
    code: `<fui-input-container>
  <label>Custom example (ipv4 validator)</label>
  <input fuiInput name="seven" [(ngModel)]="model.seven" required ipv4Address />
  <fui-control-error *fuiIfError="'required'">This field is required (this message overwrite default require message)</fui-control-error>
</fui-input-container>`,
    resultModels: ['seven'],
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
tplt = `<default-template-wrapper [pageTitle]="'Inputs Page'" [(disabled)]="disabled" [examples]="examples" 
[results]="results" (toggleEvent)="toggle($event)">${tplt}</default-template-wrapper>`;

// Export constants.
export const INPUT_EXAMPLES: Array<ExampleCode> = examplesCode;
export const INPUT_TEMPLATE: string = tplt;
