import { Directive, Optional, ViewContainerRef, ElementRef, Injector, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiInputContainer } from './input-container';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({ selector: '[fuiInput]', host: { '[class.fui-input]': 'true' } })
export class FuiInput extends WrappedFormControl<FuiInputContainer> {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
      control: NgControl,
    el: ElementRef
  ) {
    super(vcr, FuiInputContainer, injector, control, el);
  }
}
