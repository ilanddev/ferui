import { Component } from '@angular/core';

import { IfOpenService } from '../../utils/conditional/if-open.service';

import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { TestContext } from '../tests/helpers.spec';
import { FuiDatepickerViewManager } from './datepicker-view-manager';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { DateIOService } from '../date/providers/date-io.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';

export default function() {
  describe('Datepicker View Manager Component', () => {
    let context: TestContext<FuiDatepickerViewManager, TestComponent>;
    let viewManagerService: ViewManagerService;

    beforeEach(function() {
      context = this.create(FuiDatepickerViewManager, TestComponent, [
        ViewManagerService,
        DatepickerFocusService,
        IfOpenService,
        DateNavigationService,
        LocaleHelperService,
        DateIOService,
        DateFormControlService
      ]);
      viewManagerService = context.getFeruiProvider(ViewManagerService);
    });

    it('shows the daypicker when dayView is set to true', () => {
      expect(context.feruiDirective.isDayView).toBe(true);
      expect(context.feruiElement.children.length).toBe(1);
      expect(context.feruiElement.children[0].tagName).toBe('FUI-DAYPICKER');
    });

    it('shows the monthpicker when monthView is set to true', () => {
      viewManagerService.changeToMonthView();
      context.detectChanges();

      expect(context.feruiDirective.isMonthView).toBe(true);
      expect(context.feruiElement.children.length).toBe(1);
      expect(context.feruiElement.children[0].tagName).toBe('FUI-MONTHPICKER');
    });

    it('shows the yearpicker when monthView is set to true', () => {
      viewManagerService.changeToYearView();
      context.detectChanges();

      expect(context.feruiDirective.isYearView).toBe(true);
      expect(context.feruiElement.children.length).toBe(1);
      expect(context.feruiElement.children[0].tagName).toBe('FUI-YEARPICKER');
    });

    it('has the .datepicker class added to the host', () => {
      expect(context.feruiElement.classList.contains('datepicker')).toBe(true);
    });
  });
}

@Component({
  template: `
    <fui-datepicker-view-manager></fui-datepicker-view-manager>
  `
})
class TestComponent {
  constructor(private dateNavigationService: DateNavigationService) {
    this.dateNavigationService.initializeCalendar();
  }
}
