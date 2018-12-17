import { Directive, ViewContainerRef, ElementRef, Injector, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { WrappedFormControl } from '../common/wrapped-control';
import { FuiTextareaContainer } from './textarea-container';
import { Renderer2 } from '@angular/core';

@Directive({ selector: '[fuiTextarea]', host: { '[class.fui-textarea]': 'true' } })
export class FuiTextarea extends WrappedFormControl<FuiTextareaContainer> {
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
    super(vcr, FuiTextareaContainer, injector, control, renderer, el);
  }
}
