import { Directive, Optional, ViewContainerRef, ElementRef, Injector, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiInputContainer } from './input-container';
import { WrappedFormControl } from '../common/wrapped-control';
import { Renderer2 } from '@angular/core';

@Directive({
  selector: '[fuiInput]',
  host: {
    '[class.fui-input]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL',
  },
})
export class FuiInput extends WrappedFormControl<FuiInputContainer> {
  protected index = 1;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiInputContainer, injector, control, renderer, el);
  }
}
