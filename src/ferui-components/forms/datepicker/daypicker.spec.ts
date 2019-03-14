import { Component } from '@angular/core';

import { IfOpenService } from '../../utils/conditional/if-open.service';

import { DayModel } from './model/day.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { TestContext } from '../tests/helpers.spec';
import { FuiDaypicker } from './daypicker';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { DateIOService } from '../date/providers/date-io.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';

export default function() {
  describe('Daypicker Component', () => {
    let context: TestContext<FuiDaypicker, TestComponent>;
    let viewManagerService: ViewManagerService;
    let localeHelperService: LocaleHelperService;
    let dateNavigationService: DateNavigationService;

    beforeEach(function() {
      dateNavigationService = new DateNavigationService();
      // Initializing selected day just to make sure that previous and next month tests become easier
      dateNavigationService.selectedDay = new DayModel(2015, 1, 1);
      dateNavigationService.initializeCalendar();

      context = this.create(FuiDaypicker, TestComponent, [
        { provide: DateNavigationService, useValue: dateNavigationService },
        DateIOService,
        IfOpenService,
        ViewManagerService,
        LocaleHelperService,
        DatepickerFocusService,
        DateFormControlService,
      ]);
      viewManagerService = context.getFeruiProvider(ViewManagerService);
      localeHelperService = context.getFeruiProvider(LocaleHelperService);
    });

    describe('View Basics', () => {
      it('calls to open the month picker when the monthpicker trigger is clicked', () => {
        spyOn(context.feruiDirective, 'changeToMonthView');
        const button: HTMLButtonElement = context.feruiElement.querySelector('.monthpicker-trigger');

        expect(button).not.toBeNull();

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.changeToMonthView).toHaveBeenCalled();
      });

      it('calls to open the year picker when the yearpicker trigger is clicked', () => {
        spyOn(context.feruiDirective, 'changeToYearView');
        const button: HTMLButtonElement = context.feruiElement.querySelector('.yearpicker-trigger');

        expect(button).not.toBeNull();

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.changeToYearView).toHaveBeenCalled();
      });

      it('calls to navigate to the previous month', () => {
        spyOn(context.feruiDirective, 'previousMonth');
        const switchers: HTMLElement = context.feruiElement.querySelector('.calendar-switchers');
        const button: HTMLButtonElement = <HTMLButtonElement>switchers.children[0];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.previousMonth).toHaveBeenCalled();
      });

      it('calls to navigate to the current month', () => {
        spyOn(context.feruiDirective, 'currentMonth');
        const switchers: HTMLElement = context.feruiElement.querySelector('.calendar-switchers');
        const button: HTMLButtonElement = <HTMLButtonElement>switchers.children[1];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.currentMonth).toHaveBeenCalled();
      });

      it('calls to navigate to the next month', () => {
        spyOn(context.feruiDirective, 'nextMonth');
        const switchers: HTMLElement = context.feruiElement.querySelector('.calendar-switchers');
        const button: HTMLButtonElement = <HTMLButtonElement>switchers.children[2];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.nextMonth).toHaveBeenCalled();
      });
    });

    describe('Typescript API', () => {
      it('moves to the month view', () => {
        expect(viewManagerService.isDayView).toBe(true);

        context.feruiDirective.changeToMonthView();
        context.detectChanges();

        expect(viewManagerService.isDayView).toBe(false);
        expect(viewManagerService.isMonthView).toBe(true);
      });

      it('moves to the year view', () => {
        expect(viewManagerService.isDayView).toBe(true);

        context.feruiDirective.changeToYearView();
        context.detectChanges();

        expect(viewManagerService.isDayView).toBe(false);
        expect(viewManagerService.isYearView).toBe(true);
      });

      it('moves to the previous month', () => {
        const initialMonth: string = localeHelperService.localeMonthsAbbreviated[1];
        expect(context.feruiDirective.calendarMonth).toBe(initialMonth);
        expect(context.feruiDirective.calendarYear).toBe(2015);

        context.feruiDirective.previousMonth();

        expect(context.feruiDirective.calendarMonth).toBe('Jan');
        expect(context.feruiDirective.calendarYear).toBe(2015);
      });

      it('moves to the next month', () => {
        const initialMonth: string = localeHelperService.localeMonthsAbbreviated[1];
        expect(context.feruiDirective.calendarMonth).toBe(initialMonth);
        expect(context.feruiDirective.calendarYear).toBe(2015);

        context.feruiDirective.nextMonth();

        expect(context.feruiDirective.calendarMonth).toBe('Mar');
        expect(context.feruiDirective.calendarYear).toBe(2015);
      });

      it('moves to the current month', () => {
        const initialMonth: string = localeHelperService.localeMonthsAbbreviated[1];
        expect(context.feruiDirective.calendarMonth).toBe(initialMonth);
        expect(context.feruiDirective.calendarYear).toBe(2015);

        context.feruiDirective.currentMonth();

        const date: Date = new Date();
        const currentMonth: string = localeHelperService.localeMonthsAbbreviated[date.getMonth()];

        expect(context.feruiDirective.calendarMonth).toBe(currentMonth);
        expect(context.feruiDirective.calendarYear).toBe(date.getFullYear());
      });
    });
  });
}

@Component({
  template: `
    <fui-daypicker></fui-daypicker>
  `,
})
class TestComponent {}
