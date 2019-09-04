import { Component, ElementRef, Inject, Injector, Input, OnInit, Optional, SkipSelf } from '@angular/core';

import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { ViewManagerService } from './providers/view-manager.service';

import { AbstractPopover } from '../../popover/common/abstract-popover';
import { Point } from '../../popover/common/popover';
import { POPOVER_HOST_ANCHOR } from '../../popover/common/popover-host-anchor.token';

@Component({
  selector: 'fui-datepicker-view-manager',
  templateUrl: './datepicker-view-manager.html',
  providers: [ViewManagerService, DatepickerFocusService],
  host: { '[class.datepicker]': 'true' },
})
export class FuiDatepickerViewManager extends AbstractPopover implements OnInit {
  @Input() appendTo: string;

  constructor(
    @SkipSelf() parent: ElementRef,
    _injector: Injector,
    private viewManagerService: ViewManagerService,
    @Optional() @Inject(POPOVER_HOST_ANCHOR) parentHost: ElementRef
  ) {
    super(_injector, !parentHost ? parent : parentHost, -10, 15);
    this.configurePopover();
  }

  ngOnInit(): void {
    if (this.appendTo) {
      this.appendPopover(this.appendTo);
    }
  }

  /**
   * Configure Popover Direction and Close indicators
   */
  private configurePopover(): void {
    this.anchorPoint = Point.BOTTOM_LEFT;
    this.popoverPoint = Point.LEFT_TOP;
    this.closeOnOutsideClick = true;
  }

  /**
   * Returns if the current view is the monthpicker.
   */
  get isMonthView(): boolean {
    return this.viewManagerService.isMonthView;
  }

  /**
   * Returns if the current view is the yearpicker.
   */
  get isYearView(): boolean {
    return this.viewManagerService.isYearView;
  }

  /**
   * Returns if the current view is the daypicker.
   */
  get isDayView(): boolean {
    return this.viewManagerService.isDayView;
  }
}
