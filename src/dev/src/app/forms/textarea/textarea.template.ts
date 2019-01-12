import { ExampleCode } from '../abstract-control-demo.component';

const examplesCode: Array<ExampleCode> = [
  {
    title: 'No label, no wrapper :',
    code: `<textarea fuiTextarea name="one" [(ngModel)]="model.one"></textarea>`,
    resultModels: ['one'],
  },
  {
    title: 'No label, wrapper :',
    code: `<fui-textarea-container>
  <textarea fuiTextarea name="two" [(ngModel)]="model.two"></textarea>
</fui-textarea-container>`,
    resultModels: ['two'],
  },
  {
    title: 'Label, wrapper and <span class="text-danger">required</span> validator :',
    code: `<fui-textarea-container>
  <label for="three">Full example</label>
  <textarea placeholder="With placeholder" fuiTextarea id="three" name="three" [(ngModel)]="model.three"
            required></textarea>
  <fui-control-error>There was an error</fui-control-error>
</fui-textarea-container>`,
    resultModels: ['three'],
  },
  {
    title:
      'Label, wrapper, <span class="text-danger">required</span> validator but <span class="text-danger">disabled</span> :',
    code: `<fui-textarea-container>
  <label for="four">Full example (disabled)</label>
  <textarea fuiTextarea id="four" name="four" [(ngModel)]="model.four" required [disabled]="disabled"></textarea>
  <fui-control-error>This field is required</fui-control-error>
</fui-textarea-container>`,
    resultModels: ['four'],
  },
  {
    title: 'Label, wrapper, <span class="text-danger">required</span> validator, disabled and filled :',
    code: `<fui-textarea-container>
  <label for="five">Full example (disabled, filled)</label>
  <textarea fuiTextarea id="five" name="five" [(ngModel)]="model.five" required [disabled]="disabled"></textarea>
  <fui-control-error>This field is required</fui-control-error>
</fui-textarea-container>`,
    resultModels: ['five'],
  },
  {
    title: 'Multiple validators',
    code: `<fui-textarea-container>
  <label for="six">Full example (multiple validators)</label>
  <textarea fuiTextarea id="six" name="six" [(ngModel)]="model.six" required email></textarea>
  <fui-control-error *fuiIfError="'required'">This field is required</fui-control-error>
  <fui-control-error *fuiIfError="'email'">You didn't type an email address</fui-control-error>
</fui-textarea-container>`,
    resultModels: ['six'],
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
tplt = `<default-template-wrapper [pageTitle]="'Textarea Page'" [(disabled)]="disabled" [examples]="examples" 
[results]="results" (toggleEvent)="toggle($event)">${tplt}</default-template-wrapper>`;

// Export constants.
export const TEXTAREA_EXAMPLES: Array<ExampleCode> = examplesCode;
export const TEXTAREA_TEMPLATE: string = tplt;
