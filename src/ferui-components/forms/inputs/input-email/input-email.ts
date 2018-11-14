import { Component, Input } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../../abstract-value-accessor';

@Component({
  selector: 'ferui-input-email',
  providers: [MakeProvider(FeruiInputEmail)],
  template: `
    <div class="ferui-form-component ferui-input-email">
      <input title="{{label}}" type="email" (input)="onChange($event.target.value)"/>
      <label class="ferui-label" [class]="{'ferui-placeholder': isPlaceholder}">{{isPlaceholder && placeholder ? placeholder : label}}</label>
    </div>`
})
export class FeruiInputEmail extends AbstractValueAccessor<string> {

  @Input()
  label: string;

  @Input()
  placeholder: string;

  isPlaceholder: boolean;
}
