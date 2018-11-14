import { Component, Input, OnInit } from '@angular/core';
import { AbstractValueAccessor, MakeProvider } from '../../abstract-value-accessor';

@Component({
  selector: 'ferui-input-text',
  providers: [MakeProvider(FeruiInputTextComponent)],
  templateUrl: './input-text.component.html',
  styleUrls: ['../input.scss', './input-text.component.scss']
})
export class FeruiInputTextComponent extends AbstractValueAccessor<string> implements OnInit {

  @Input()
  label: string;

  isPlaceholder: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
