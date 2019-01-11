import { Directive, ElementRef, Injector, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';
import { FuiRadioWrapper } from '../radio/radio-wrapper';

@Directive({ selector: '[fuiRadio]' })
export class FuiRadio extends WrappedFormControl<FuiRadioWrapper> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiRadioWrapper, injector, control, renderer, el);
  }
}
