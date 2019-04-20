import { Directive, Optional, ViewContainerRef, ElementRef, Injector, Self, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { FuiSelectContainer } from './select-container';
import { WrappedFormControl } from '../common/wrapped-control';
import { Renderer2 } from '@angular/core';
import { FuiSelectService } from './select.service';
import { NgSelectComponent } from '@ng-select/ng-select';

@Directive({
  selector: '[fuiSelect]',
  host: {
    '[class.fui-select]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL',
  },
})
export class FuiSelect extends WrappedFormControl<FuiSelectContainer> implements OnInit {
  private selectService: FuiSelectService;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Self()
    @Optional()
    public ngSelect: NgSelectComponent
  ) {
    super(vcr, FuiSelectContainer, injector, control, renderer, el);
    try {
      this.selectService = injector.get(FuiSelectService);
    } catch (e) {}
  }

  hasNgSelect(): boolean {
    return !!this.ngSelect;
  }

  ngOnInit() {
    super.ngOnInit();
    this.selectService = this.loadServiceFromParent(this.selectService, FuiSelectService);

    if (this.selectService) {
      this.selectService.fuiSelect = this;
    }
  }
}
