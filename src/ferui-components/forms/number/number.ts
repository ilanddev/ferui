import { Directive, Optional, ViewContainerRef, ElementRef, Injector, Self, HostBinding, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiNumberContainer } from './number-container';
import { WrappedFormControl } from '../common/wrapped-control';
import { Renderer2 } from '@angular/core';
import { NumberIoService } from './providers/number-io.service';

@Directive({
  selector: '[fuiNumber]',
  host: {
    '[class.fui-number]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  }
})
export class FuiNumber extends WrappedFormControl<FuiNumberContainer> implements OnInit {
  @Input('step')
  set step(value: number) {
    if (this.numberIOService) {
      this.numberIOService.step = value;
    }
  }

  @Input('max')
  set max(value: number) {
    if (this.numberIOService) {
      this.numberIOService.max = value;
    }
  }

  @Input('min')
  set min(value: number) {
    if (this.numberIOService) {
      this.numberIOService.min = value;
    }
  }

  protected index = 1;

  @HostBinding('attr.min')
  get nativeMin(): string {
    if (this.numberIOService && this.numberIOService.min !== null && this.numberIOService.min !== undefined) {
      return this.numberIOService.min.toString();
    }
    return '';
  }

  @HostBinding('attr.max')
  get nativeMax(): string {
    if (this.numberIOService && this.numberIOService.max !== null && this.numberIOService.max !== undefined) {
      return this.numberIOService.max.toString();
    }
    return '';
  }

  @HostBinding('attr.step')
  get nativeStep(): string {
    if (this.numberIOService && this.numberIOService.step !== null && this.numberIOService.step !== undefined) {
      return this.numberIOService.step.toString();
    }
    return '';
  }

  /**
   * Sets the input type to text when the datepicker is enabled. Reverts back to the native date input
   * when the datepicker is disabled. Datepicker is disabled on mobiles.
   */
  @HostBinding('attr.type')
  get inputType(): string {
    return 'number';
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    private control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional() private numberIOService: NumberIoService
  ) {
    super(vcr, FuiNumberContainer, injector, control, renderer, el);
  }
}
