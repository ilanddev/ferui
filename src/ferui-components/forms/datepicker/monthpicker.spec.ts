import { Component } from '@angular/core';
import { async } from '@angular/core/testing';

import { itIgnore } from '../../../../tests/tests.helpers';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '../../utils/key-codes/key-codes';

import { DayModel } from './model/day.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { createKeyboardEvent } from './utils/test-utils';
import { TestContext } from '../tests/helpers.spec';
import { FuiMonthpicker } from './monthpicker';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { DateIOService } from '../date/providers/date-io.service';

export default function() {
  describe('Monthpicker Component', () => {
    let context: TestContext<FuiMonthpicker, TestComponent>;
    let localeHelperService: LocaleHelperService;
    let dateNavigationService: DateNavigationService;
    const selectedMonth: number = 1;

    function initializeCalendar(selectedDay: DayModel) {
      dateNavigationService = new DateNavigationService();
      // Setting a selected date so that the calendar is initialized to that month and year.
      dateNavigationService.selectedDay = selectedDay;
      dateNavigationService.initializeCalendar();
    }

    describe('View Basics', () => {
      beforeEach(function() {
        initializeCalendar(new DayModel(2015, selectedMonth, 1));

        context = this.create(FuiMonthpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          IfOpenService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateIOService
        ]);
        localeHelperService = context.getFeruiProvider(LocaleHelperService);
      });

      it('renders the months correctly', () => {
        const months: ReadonlyArray<string> = localeHelperService.localeMonthsWide;
        const buttonsWrapper: any = context.feruiElement.querySelector('.month-wrapper');
        const buttons: HTMLButtonElement[] = buttonsWrapper.querySelectorAll('button');

        expect(buttons.length).toBe(months.length);

        let count: number = 0;
        for (const button of buttons) {
          expect(button.textContent.trim()).toMatch(months[count]);
          count++;
        }
      });

      it('changes month when a month is clicked', () => {
        spyOn(context.feruiDirective, 'changeMonth');

        const buttonsWrapper: any = context.feruiElement.querySelector('.month-wrapper');
        const buttons: HTMLButtonElement[] = buttonsWrapper.querySelectorAll('button');

        buttons[0].click();
        context.detectChanges();

        expect(context.feruiDirective.changeMonth).toHaveBeenCalled();
      });

      it('has the correct month selected', () => {
        const buttonsWrapper: any = context.feruiElement.querySelector('.month-wrapper');
        const buttons: HTMLButtonElement[] = buttonsWrapper.querySelectorAll('button');
        expect(buttons[selectedMonth].classList.contains('is-selected')).toBe(true);
      });

      it('initializes the tab indices correctly', () => {
        const buttonsWrapper: any = context.feruiElement.querySelector('.month-wrapper');
        const buttons: HTMLButtonElement[] = buttonsWrapper.querySelectorAll('button');
        let count: number = 0;
        for (const button of buttons) {
          if (count === selectedMonth) {
            expect(button.tabIndex).toBe(context.feruiDirective.getTabIndex(count));
          } else {
            expect(button.tabIndex).toBe(context.feruiDirective.getTabIndex(count));
          }
          count++;
        }
      });

      // IE doesn't support KeyboardEvent constructor
      itIgnore(
        ['ie'],
        'updates the tab indices correctly',
        async(() => {
          const buttonsWrapper: any = context.feruiElement.querySelector('.month-wrapper');
          const buttons: HTMLButtonElement[] = buttonsWrapper.querySelectorAll('button');
          expect(buttons[1].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(DOWN_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[1].tabIndex).toBe(-1);
          expect(buttons[2].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(UP_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[2].tabIndex).toBe(-1);
          expect(buttons[1].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[1].tabIndex).toBe(-1);
          expect(buttons[7].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(LEFT_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[7].tabIndex).toBe(-1);
          expect(buttons[1].tabIndex).toBe(0);
        })
      );
    });

    describe('Typescript API', () => {
      beforeEach(function() {
        initializeCalendar(new DayModel(2015, selectedMonth, 1));

        context = this.create(FuiMonthpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          IfOpenService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateIOService
        ]);
        localeHelperService = context.getFeruiProvider(LocaleHelperService);
      });

      it('has access to the month array', () => {
        const months: ReadonlyArray<string> = localeHelperService.localeMonthsWide;

        let count: number = 0;
        for (const month of localeHelperService.localeMonthsWide) {
          expect(month).toMatch(months[count]);
          count++;
        }
      });

      it('gets the current month name in wide format', () => {
        expect(context.feruiDirective.calendarMonthIndex).toBe(selectedMonth);
      });

      it('gets the correct tabindex', () => {
        for (let i = 0; i < context.feruiDirective.monthNames.length; i++) {
          if (i === selectedMonth) {
            expect(context.feruiDirective.getTabIndex(i)).toBe(0);
          } else {
            expect(context.feruiDirective.getTabIndex(i)).toBe(-1);
          }
        }
      });

      it('changes view to day picker when change month is called', () => {
        const viewManagerService: ViewManagerService = context.getFeruiProvider(ViewManagerService);

        viewManagerService.changeToMonthView();
        expect(viewManagerService.isMonthView).toBe(true);

        context.feruiDirective.changeMonth(0);

        expect(viewManagerService.isMonthView).toBe(false);
        expect(viewManagerService.isDayView).toBe(true);
      });

      it('updates the month value in the date navigation service', () => {
        const dateNavService: DateNavigationService = context.getFeruiProvider(DateNavigationService);

        expect(dateNavService.displayedCalendar.month).toBe(1);

        context.feruiDirective.changeMonth(4);

        expect(dateNavService.displayedCalendar.month).toBe(4);
      });
    });

    describe('Keyboard Navigation', () => {
      //  Monthpicker Layout
      //  Jan   |   Jul
      //  Feb   |   Aug
      //  Mar   |   Sept
      //  Apr   |   Oct
      //  May   |   Nov
      //  Jun   |   Dec

      function createMonthPicker(scope: any, selectedDay: DayModel) {
        initializeCalendar(selectedDay);

        context = scope.create(FuiMonthpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          IfOpenService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateIOService
        ]);
      }

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles the up arrow', function() {
        createMonthPicker(this, new DayModel(2015, 11, 1));

        expect(context.feruiDirective.getTabIndex(11)).toBe(0, "Month 11 doesn't have tabindex 0");

        for (let i = 10; i >= 0; i--) {
          context.feruiDirective.onKeyDown(createKeyboardEvent(UP_ARROW, 'keydown'));
          expect(context.feruiDirective.getTabIndex(i)).toBe(0, 'Month ' + i + " doesn't have tabindex 0");
          expect(context.feruiDirective.getTabIndex(i + 1)).toBe(-1, 'Month ' + (i + 1) + " doesn't have tabindex -1");
        }

        // Boundary
        expect(context.feruiDirective.getTabIndex(0)).toBe(0, "Month 0 does't have tabindex 0");
        context.feruiDirective.onKeyDown(createKeyboardEvent(UP_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(0)).toBe(0, "Month 0 does't have tabindex 0");
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles the down arrow', function() {
        createMonthPicker(this, new DayModel(2015, 0, 1));

        expect(context.feruiDirective.getTabIndex(0)).toBe(0, "Month 0 doesn't have tabindex 0");

        for (let i = 1; i <= 11; i++) {
          context.feruiDirective.onKeyDown(createKeyboardEvent(DOWN_ARROW, 'keydown'));
          expect(context.feruiDirective.getTabIndex(i)).toBe(0, 'Month ' + i + " doesn't have tabindex 0");
          expect(context.feruiDirective.getTabIndex(i - 1)).toBe(-1, 'Month ' + (i - 1) + " doesn't have tabindex -1");
        }

        // Boundary
        expect(context.feruiDirective.getTabIndex(11)).toBe(0, "Month 11 does't have tabindex 0");
        context.feruiDirective.onKeyDown(createKeyboardEvent(DOWN_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(11)).toBe(0, "Month 11 does't have tabindex 0");
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles the right arrow', function() {
        createMonthPicker(this, new DayModel(2015, 0, 1));
        expect(context.feruiDirective.getTabIndex(0)).toBe(0, "Month 0 doesn't have tabindex 0");

        for (let i = 0; i < 5; i++) {
          // Inner for loop tests boundary
          // We start with the 0th index and move right twice
          for (let j = 0; j < 2; j++) {
            context.feruiDirective.onKeyDown(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
            expect(context.feruiDirective.getTabIndex(i + 6)).toBe(0, 'Month ' + (i + 6) + "doesn't have tabindex 0");
            expect(context.feruiDirective.getTabIndex(i)).toBe(-1, 'Month ' + i + "doesn't have tabindex -1");
          }

          // After each boundary test we adjust the focus to the next month
          // Jan -> Feb -> Mar -> Apr -> May -> Jun
          context.feruiDirective.onKeyDown(createKeyboardEvent(DOWN_ARROW, 'keydown'));
          context.feruiDirective.onKeyDown(createKeyboardEvent(LEFT_ARROW, 'keydown'));
        }

        expect(context.feruiDirective.getTabIndex(5)).toBe(0, "Month 5 doesn't have the tabindex 0");
        context.feruiDirective.onKeyDown(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(5)).toBe(-1, "Month 5 doesn't have the tabindex -1");
        expect(context.feruiDirective.getTabIndex(11)).toBe(0, "Month 11 doesn't have the tabindex -1");
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles the left arrow', function() {
        createMonthPicker(this, new DayModel(2015, 6, 1));
        expect(context.feruiDirective.getTabIndex(6)).toBe(0, "Month 6 doesn't have tabindex 0");

        for (let i = 0; i < 5; i++) {
          // Inner for loop tests boundary
          // We start with the 6th index and move left twice
          for (let j = 0; j < 2; j++) {
            context.feruiDirective.onKeyDown(createKeyboardEvent(LEFT_ARROW, 'keydown'));
            expect(context.feruiDirective.getTabIndex(i)).toBe(0, 'Month ' + i + "doesn't have tabindex 0");
            expect(context.feruiDirective.getTabIndex(i + 6)).toBe(-1, 'Month ' + (i + 6) + "doesn't have tabindex -1");
          }

          // After each boundary test we adjust the focus to the next month
          // Jul -> Aug -> Sept -> Oct -> Nov -> Dec
          context.feruiDirective.onKeyDown(createKeyboardEvent(DOWN_ARROW, 'keydown'));
          context.feruiDirective.onKeyDown(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
        }

        expect(context.feruiDirective.getTabIndex(11)).toBe(0, "Month 11 doesn't have the tabindex 0");
        context.feruiDirective.onKeyDown(createKeyboardEvent(LEFT_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(5)).toBe(0, "Month 5 doesn't have the tabindex 0");
        expect(context.feruiDirective.getTabIndex(11)).toBe(-1, "Month 11 doesn't have the tabindex -1");
      });
    });
  });
}

@Component({
  template: `
    <fui-monthpicker></fui-monthpicker>
  `
})
class TestComponent {}
