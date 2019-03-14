import { Component } from '@angular/core';

import { itIgnore } from '../../../../tests/tests.helpers';
import { TestContext } from '../tests/helpers.spec';
import { IfOpenService } from '../../utils/conditional/if-open.service';

import { FuiDay } from './day';
import { DayViewModel } from './model/day-view.model';
import { DayModel } from './model/day.model';
import { LocaleHelperService } from './providers/locale-helper.service';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { DateIOService } from '../date/providers/date-io.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';

export default function() {
  describe('Day Component', () => {
    let context: TestContext<FuiDay, TestComponent>;

    beforeEach(function() {
      context = this.create(FuiDay, TestComponent, [
        LocaleHelperService,
        DateNavigationService,
        DateIOService,
        IfOpenService,
        DateFormControlService,
      ]);
    });

    describe('View Basics', function() {
      it('renders the content based on the input provided', function() {
        expect(context.feruiElement.textContent.trim()).toMatch('1');

        context.testComponent.dayView = new DayViewModel(new DayModel(2018, 0, 25), false, false, false, false);
        context.detectChanges();
        expect(context.feruiElement.textContent.trim()).toMatch('25');
      });

      it('renders one button based on the input provided', function() {
        expect(context.feruiElement.children.length).toBe(1);
        expect(context.feruiElement.children[0].tagName).toBe('BUTTON');
      });

      it("adds the .is-today class to the button when the input provided is today's day view", function() {
        const button: HTMLButtonElement = context.feruiElement.children[0];
        expect(button.classList.contains('is-today')).toBe(false);
        context.testComponent.dayView.isTodaysDate = true;
        context.detectChanges();
        expect(button.classList.contains('is-today')).toBe(true);

        context.testComponent.dayView.isTodaysDate = false;
        context.detectChanges();
        expect(button.classList.contains('is-today')).toBe(false);
      });

      it('adds the .is-selected class to the button when the input day view is selected', function() {
        const button: HTMLButtonElement = context.feruiElement.children[0];
        expect(button.classList.contains('is-selected')).toBe(false);
        context.testComponent.dayView.isSelected = true;
        context.detectChanges();
        expect(button.classList.contains('is-selected')).toBe(true);

        context.testComponent.dayView.isSelected = false;
        context.detectChanges();
        expect(button.classList.contains('is-selected')).toBe(false);
      });

      it('adds the .is-disabled class to the button when the input day view is selected', function() {
        const button: HTMLButtonElement = context.feruiElement.children[0];
        expect(button.classList.contains('is-disabled')).toBe(false);
        context.testComponent.dayView.isDisabled = true;
        context.detectChanges();
        expect(button.classList.contains('is-disabled')).toBe(true);

        context.testComponent.dayView.isDisabled = false;
        context.detectChanges();
        expect(button.classList.contains('is-disabled')).toBe(false);
      });

      it('sets the right tabindex if the day is focusable', function() {
        const button: HTMLButtonElement = context.feruiElement.children[0];
        expect(button.tabIndex).toBe(-1);

        context.testComponent.dayView.isFocusable = true;
        context.detectChanges();
        expect(button.tabIndex).toBe(0);

        context.testComponent.dayView.isFocusable = false;
        context.detectChanges();
        expect(button.tabIndex).toBe(-1);
      });

      it('updates the date when a button in the day component is clicked', () => {
        spyOn(context.feruiDirective, 'selectDay');
        const button: HTMLButtonElement = context.feruiElement.children[0];

        button.click();
        context.detectChanges();

        expect(context.feruiDirective.selectDay).toHaveBeenCalled();
      });

      // @TODO determine if this actually fails in IE
      itIgnore(['ie'], 'updates the focusable date when a button is focused', () => {
        spyOn(context.feruiDirective, 'onDayViewFocus');
        const button: HTMLButtonElement = context.feruiElement.children[0];

        button.focus();
        context.detectChanges();

        expect(context.feruiDirective.onDayViewFocus).toHaveBeenCalled();
      });
    });

    describe('Template API', function() {
      it('supports an Input for DayViewModel', () => {
        expect(context.feruiDirective.dayView).not.toBeUndefined();
        expect(context.feruiDirective.dayView.dayModel.date).toBe(1);
        expect(context.feruiDirective.dayView.dayModel.month).toBe(0);
        expect(context.feruiDirective.dayView.dayModel.year).toBe(2018);
        expect(context.feruiDirective.dayView.isTodaysDate).toBe(false);
        expect(context.feruiDirective.dayView.isSelected).toBe(false);
        expect(context.feruiDirective.dayView.isDisabled).toBe(false);
        expect(context.feruiDirective.dayView.isFocusable).toBe(false);
      });
    });

    describe('Typescript API', function() {
      it('updates the selected day when a Date is selected', () => {
        const dateNavigationService: DateNavigationService = context.getFeruiProvider(DateNavigationService);
        const testDayView: DayViewModel = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);

        expect(dateNavigationService.selectedDay).toBeUndefined();

        context.feruiDirective.dayView = testDayView;
        context.feruiDirective.selectDay();
        context.detectChanges();

        expect(dateNavigationService.selectedDay).not.toBeUndefined();
        expect(dateNavigationService.selectedDay.date).toBe(testDayView.dayModel.date);
        expect(dateNavigationService.selectedDay.month).toBe(testDayView.dayModel.month);
        expect(dateNavigationService.selectedDay.year).toBe(testDayView.dayModel.year);
      });

      it('notifies the DateNavigationService when the user selects a date', () => {
        const dateNavigationService: DateNavigationService = context.getFeruiProvider(DateNavigationService);
        spyOn(dateNavigationService, 'notifySelectedDayChanged');

        context.feruiDirective.dayView = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);
        context.feruiDirective.selectDay();
        context.detectChanges();

        expect(dateNavigationService.notifySelectedDayChanged).toHaveBeenCalledWith(
          context.feruiDirective.dayView.dayModel
        );
      });

      it('closes the popover when a Date is selected', () => {
        const ifOpenService: IfOpenService = context.getFeruiProvider(IfOpenService);
        expect(ifOpenService.open).toBeUndefined();
        context.feruiDirective.dayView = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);
        context.feruiDirective.selectDay();
        context.detectChanges();

        expect(ifOpenService.open).toBe(false);
      });

      it('updates the focusedDay when a day is focused', () => {
        const dateNavigationService: DateNavigationService = context.getFeruiProvider(DateNavigationService);
        const testDayView: DayViewModel = new DayViewModel(new DayModel(2018, 0, 1), false, false, false, false);

        expect(dateNavigationService.focusedDay).toBeUndefined();

        context.feruiDirective.dayView = testDayView;
        context.feruiDirective.onDayViewFocus();
        context.detectChanges();

        expect(dateNavigationService.focusedDay).not.toBeUndefined();
        expect(dateNavigationService.focusedDay.date).toBe(testDayView.dayModel.date);
        expect(dateNavigationService.focusedDay.month).toBe(testDayView.dayModel.month);
        expect(dateNavigationService.focusedDay.year).toBe(testDayView.dayModel.year);
      });

      it('marks the date control as dirty when a date is selected', () => {
        const dateFormControlService: DateFormControlService = context.getFeruiProvider(DateFormControlService);
        spyOn(dateFormControlService, 'markAsDirty');

        context.feruiDirective.selectDay();

        expect(dateFormControlService.markAsDirty).toHaveBeenCalled();
      });
    });
  });
}

@Component({
  template: `
    <fui-day [fuiDayView]="dayView"></fui-day>
  `,
})
class TestComponent {
  isToday: boolean = false;
  isDisabled: boolean = false;
  isSelected: boolean = false;
  isFocusable: boolean = false;
  dayModel: DayModel = new DayModel(2018, 0, 1);

  dayView: DayViewModel = new DayViewModel(
    this.dayModel,
    this.isToday,
    this.isDisabled,
    this.isSelected,
    this.isFocusable
  );
}
