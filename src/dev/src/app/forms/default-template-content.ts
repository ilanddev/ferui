import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { isArray } from 'util';

@Component({
  selector: 'default-template-content',
  template: `
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
            <h5 class="mt-3">
              <ng-content select="title"></ng-content>
            </h5>
            <ng-content select="description"></ng-content>
            <ng-content></ng-content>
          </div>
        </div>
        <div class="row pt-3" *ngIf="code">
          <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
            <p>
              Result (<button class="btn btn-link p-0" (click)="toggle([results, idx])">
                {{ results[idx] ? 'Hide Results' : 'View Results' }}</button
              >)
            </p>
            <pre
              *ngIf="results[idx]"
            ><code [languages]="['json']" [highlight]="concatResultModels(model, resultModelNames) | json"></code></pre>
          </div>
          <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
            <p>
              Code (<button class="btn btn-link p-0" (click)="toggle([examples, idx])">
                {{ examples[idx] ? 'Hide code' : 'View code' }}</button
              >)
            </p>
            <pre *ngIf="examples[idx]"><code [languages]="['xml']" [highlight]="code"></code></pre>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DefaultTemplateContent {
  @Input() disabled: boolean;
  @Input() code: string;
  @Input() examples: Array<boolean>;
  @Input() results: Array<boolean>;
  @Input() idx: number;
  @Input() model: any;
  @Input() resultModelNames: Array<string>;

  concatResultModels(models, ...modelNames): Array<any> {
    const results: Array<any> = [];
    for (const name of modelNames) {
      if (isArray(name)) {
        for (const n of name) {
          results.push({
            'field-name': n,
            value: models[n],
          });
        }
      } else {
        results.push({
          'field-name': name,
          value: models[name],
        });
      }
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
}
