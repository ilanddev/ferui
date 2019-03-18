import { Directive, Optional, ViewContainerRef, ElementRef, Injector, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiSelectContainer } from './select-container';
import { WrappedFormControl } from '../common/wrapped-control';
import { Renderer2 } from '@angular/core';

@Directive({ selector: '[fuiSelect]', host: { '[class.fui-select]': 'true' } })
export class FuiSelect extends WrappedFormControl<FuiSelectContainer> {
  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    super(vcr, FuiSelectContainer, injector, control, renderer, el);
  }
}
