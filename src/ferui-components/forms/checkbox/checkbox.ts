import { Directive, Renderer2, ElementRef, Injector, Self, Optional, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FuiCheckboxWrapper } from './checkbox-wrapper';
import { WrappedFormControl } from '../common/wrapped-control';

@Directive({ selector: '[fuiCheckbox]' })
export class FuiCheckbox extends WrappedFormControl<FuiCheckboxWrapper> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiCheckboxWrapper, injector, control, renderer, el);
  }
}
