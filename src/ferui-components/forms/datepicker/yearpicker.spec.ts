import { Component } from '@angular/core';
import { async } from '@angular/core/testing';

import { itIgnore } from '../../../../tests/tests.helpers';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '../../utils/key-codes/key-codes';

import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { createKeyboardEvent } from './utils/test-utils';
import { TestContext } from '../tests/helpers.spec';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { FuiYearpicker } from './yearpicker';
import { DateIOService } from '../date/providers/date-io.service';

export default function() {
  describe('Yearpicker Component', () => {
    let context: TestContext<FuiYearpicker, TestComponent>;
    let dateNavigationService: DateNavigationService;
    const selectedYear: number = 2003;
    const yearsToDisplay: number = 18;

    function initializeCalendar(selYear: number) {
      dateNavigationService = new DateNavigationService();
      dateNavigationService.initializeCalendar();
      dateNavigationService.changeYear(selYear);
    }

    describe('View Basics', () => {
      beforeEach(function() {
        initializeCalendar(selectedYear);

        context = this.create(FuiYearpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          IfOpenService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateIOService
        ]);
      });

      it('renders the year range', () => {
        const years: HTMLButtonElement[] = context.feruiElement.querySelectorAll('.year');
        expect(years).not.toBeNull();
        expect(years.length).toBe(yearsToDisplay);

        for (let i = 0; i < yearsToDisplay; i++) {
          expect(years[i].textContent).toMatch(`${1998 + i}`);
        }
      });

      it('calls to navigate to the previous decade', () => {
        spyOn(context.feruiDirective, 'previousDecade');
        const switchers: HTMLElement = context.feruiElement.querySelector('.calendar-switchers');
        const button: HTMLButtonElement = <HTMLButtonElement>switchers.children[0];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.previousDecade).toHaveBeenCalled();
      });

      it('calls to navigate to the current decade', () => {
        spyOn(context.feruiDirective, 'currentDecade');
        const switchers: HTMLElement = context.feruiElement.querySelector('.calendar-switchers');
        const button: HTMLButtonElement = <HTMLButtonElement>switchers.children[1];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.currentDecade).toHaveBeenCalled();
      });

      it('calls to navigate to the next decade', () => {
        spyOn(context.feruiDirective, 'nextDecade');
        const switchers: HTMLElement = context.feruiElement.querySelector('.calendar-switchers');
        const button: HTMLButtonElement = <HTMLButtonElement>switchers.children[2];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.nextDecade).toHaveBeenCalled();
      });

      it('updates the year when a year button is clicked', () => {
        spyOn(context.feruiDirective, 'changeYear');
        const years: HTMLButtonElement[] = context.feruiElement.querySelectorAll('.year');

        for (const year of years) {
          year.click();
          context.detectChanges();
          expect(context.feruiDirective.changeYear).toHaveBeenCalled();
        }
      });

      it('adds a .yearpicker class on the host', () => {
        expect(context.feruiElement.classList.contains('yearpicker')).toBe(true);
      });

      it('adds a .is-selected class on the selected year', () => {
        const yearIndex: number = context.feruiDirective.yearRangeModel.yearRange.indexOf(selectedYear);
        const years: HTMLButtonElement[] = context.feruiElement.querySelectorAll('.year');

        let count: number = 0;
        for (const year of years) {
          if (count === yearIndex) {
            expect(year.classList.contains('is-selected')).toBe(true);
          } else {
            expect(year.classList.contains('is-selected')).toBe(false);
          }
          count++;
        }
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(
        ['ie'],
        'updates the tab indices correctly',
        async(() => {
          const buttons: HTMLButtonElement[] = context.feruiElement.querySelectorAll('.year');

          expect(buttons[5].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(DOWN_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[5].tabIndex).toBe(-1);
          expect(buttons[6].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(UP_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[6].tabIndex).toBe(-1);
          expect(buttons[5].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[5].tabIndex).toBe(-1);
          expect(buttons[11].tabIndex).toBe(0);

          context.feruiElement.dispatchEvent(createKeyboardEvent(LEFT_ARROW, 'keydown'));
          context.detectChanges();

          expect(buttons[11].tabIndex).toBe(-1);
          expect(buttons[5].tabIndex).toBe(0);
        })
      );
    });

    describe('Typescript API', () => {
      beforeEach(function() {
        initializeCalendar(selectedYear);

        context = this.create(FuiYearpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          IfOpenService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateIOService
        ]);
      });

      it('has access to the calendar year', () => {
        expect(context.feruiDirective.calendarYear).toBe(selectedYear);
      });

      it('generates a YearRangeModel based on the selected year on initialization', () => {
        const testArr: number[] = [
          1998,
          1999,
          2000,
          2001,
          2002,
          2003,
          2004,
          2005,
          2006,
          2007,
          2008,
          2009,
          2010,
          2011,
          2012,
          2013,
          2014,
          2015
        ];
        expect(context.feruiDirective.yearRangeModel).not.toBeNull();
        expect(context.feruiDirective.yearRangeModel.yearRange.length).toBe(yearsToDisplay);

        expect(context.feruiDirective.yearRangeModel.yearRange).toEqual(testArr);
      });

      it('updates the year range model when moving to the previous decade', () => {
        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear)).toBe(true);

        context.feruiDirective.previousDecade();

        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear)).toBe(false);
        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear - yearsToDisplay)).toBe(true);
      });

      it('updates the year range model when moving to the next decade', () => {
        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear)).toBe(true);

        context.feruiDirective.nextDecade();

        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear)).toBe(false);
        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear + yearsToDisplay)).toBe(true);
      });

      it('updates the year range model when moving to the current decade', () => {
        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear)).toBe(true);

        context.feruiDirective.currentDecade();

        expect(context.feruiDirective.yearRangeModel.inRange(selectedYear)).toBe(false);
        expect(context.feruiDirective.yearRangeModel.inRange(new Date().getFullYear())).toBe(true);
      });

      it('does not regenerate the year range when its on the current decade', () => {
        // Move to the current decade
        context.feruiDirective.currentDecade();
        expect(context.feruiDirective.yearRangeModel.inRange(new Date().getFullYear())).toBe(true);

        // Move again and check
        spyOn(context.feruiDirective.yearRangeModel, 'currentDecade');
        context.feruiDirective.currentDecade();
        expect(context.feruiDirective.yearRangeModel.currentDecade).not.toHaveBeenCalled();
      });

      it('gets the correct tab indices on initialization', () => {
        const years: number[] = context.feruiDirective.yearRangeModel.yearRange;

        for (const year of years) {
          if (year === selectedYear) {
            expect(context.feruiDirective.getTabIndex(year)).toBe(0);
          } else {
            expect(context.feruiDirective.getTabIndex(year)).toBe(-1);
          }
        }
      });

      it('changes view to day picker when changeYear is called', () => {
        const viewManagerService: ViewManagerService = context.getFeruiProvider(ViewManagerService);

        viewManagerService.changeToYearView();
        expect(viewManagerService.isYearView).toBe(true);

        context.feruiDirective.changeYear(2015);

        expect(viewManagerService.isYearView).toBe(false);
        expect(viewManagerService.isDayView).toBe(true);
      });

      it('updates year value in the date navigation service', () => {
        const dateNavService: DateNavigationService = context.getFeruiProvider(DateNavigationService);

        expect(dateNavService.displayedCalendar.year).toBe(selectedYear);

        context.feruiDirective.changeYear(2015);

        expect(dateNavService.displayedCalendar.year).toBe(2015);
      });
    });

    describe('Keyboard Navigation', () => {
      // Yearpicker Layout
      // 1998 | 2004 | 2010
      // 1999 | 2005 | 2011
      // 2000 | 2006 | 2012
      // 2001 | 2007 | 2013
      // 2002 | 2008 | 2014
      // 2003 | 2009 | 2015

      function createYearPicker(scope: any, selYear: number) {
        initializeCalendar(selYear);

        context = scope.create(FuiYearpicker, TestComponent, [
          ViewManagerService,
          DatepickerFocusService,
          IfOpenService,
          { provide: DateNavigationService, useValue: dateNavigationService },
          LocaleHelperService,
          DateIOService
        ]);
      }

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles up arrow', function() {
        createYearPicker(this, 2016);

        // Boundary
        expect(context.feruiDirective.getTabIndex(2016)).toBe(0);
        expect(context.feruiDirective.yearRangeModel.inRange(2015)).toBe(false);

        for (let i = 2015; i >= 1998; i--) {
          context.feruiDirective.onKeyDown(createKeyboardEvent(UP_ARROW, 'keydown'));
          expect(context.feruiDirective.getTabIndex(i)).toBe(0);
        }

        expect(context.feruiDirective.yearRangeModel.inRange(2016)).toBe(false);
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles down arrow', function() {
        createYearPicker(this, 2015);

        // Boundary
        expect(context.feruiDirective.getTabIndex(2015)).toBe(0);
        expect(context.feruiDirective.yearRangeModel.inRange(2016)).toBe(false);

        for (let i = 2016; i <= 2033; i++) {
          context.feruiDirective.onKeyDown(createKeyboardEvent(DOWN_ARROW, 'keydown'));
          expect(context.feruiDirective.getTabIndex(i)).toBe(0);
        }

        expect(context.feruiDirective.yearRangeModel.inRange(2016)).toBe(true);
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles right arrow', function() {
        createYearPicker(this, 2001);
        expect(context.feruiDirective.getTabIndex(2001)).toBe(0);
        context.feruiDirective.onKeyDown(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(2007)).toBe(0);
        context.feruiDirective.onKeyDown(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(2013)).toBe(0);

        // Boundary
        expect(context.feruiDirective.yearRangeModel.inRange(2019)).toBe(false);
        context.feruiDirective.onKeyDown(createKeyboardEvent(RIGHT_ARROW, 'keydown'));
        expect(context.feruiDirective.yearRangeModel.inRange(2019)).toBe(true);
        expect(context.feruiDirective.getTabIndex(2019)).toBe(0);
      });

      // IE doesn't handle KeyboardEvent constructor
      itIgnore(['ie'], 'handles left arrow', function() {
        createYearPicker(this, 2005);
        expect(context.feruiDirective.getTabIndex(2005)).toBe(0);
        context.feruiDirective.onKeyDown(createKeyboardEvent(LEFT_ARROW, 'keydown'));
        expect(context.feruiDirective.getTabIndex(1999)).toBe(0);

        // Boundary
        expect(context.feruiDirective.yearRangeModel.inRange(1993)).toBe(false);
        context.feruiDirective.onKeyDown(createKeyboardEvent(LEFT_ARROW, 'keydown'));
        expect(context.feruiDirective.yearRangeModel.inRange(1993)).toBe(true);
        expect(context.feruiDirective.getTabIndex(1993)).toBe(0);
      });
    });
  });
}

@Component({
  template: `
    <fui-yearpicker></fui-yearpicker>
  `
})
class TestComponent {}
