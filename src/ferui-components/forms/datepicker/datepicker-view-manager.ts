import { Component, ElementRef, Injector, SkipSelf } from '@angular/core';

import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { ViewManagerService } from './providers/view-manager.service';

import { AbstractPopover } from '../../popover/common/abstract-popover';
import { Point } from '../../popover/common/popover';

@Component({
  selector: 'fui-datepicker-view-manager',
  templateUrl: './datepicker-view-manager.html',
  providers: [ViewManagerService, DatepickerFocusService],
  host: { '[class.datepicker]': 'true' },
})
export class FuiDatepickerViewManager extends AbstractPopover {
  constructor(@SkipSelf() parent: ElementRef, _injector: Injector, private viewManagerService: ViewManagerService) {
    super(_injector, parent, -10, 15);
    this.configurePopover();
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
