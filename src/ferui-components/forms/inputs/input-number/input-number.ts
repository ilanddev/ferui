import { Component, Input } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../../abstract-value-accessor';

@Component({
  selector: 'ferui-input-number',
  providers: [MakeProvider(FeruiInputNumber)],
  template: `
    <div class="ferui-form-component ferui-input-number">
      <input title="{{label}}" type="number" (input)="onChange($event.target.value)"/>
      <label class="ferui-label" [class]="{'ferui-placeholder': isPlaceholder}">{{label}}</label>
    </div>`
})
export class FeruiInputNumber extends AbstractValueAccessor<number> {

  @Input()
  label: string;

  isPlaceholder: boolean;
}
