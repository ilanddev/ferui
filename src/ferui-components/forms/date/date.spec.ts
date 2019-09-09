import { Component, DebugElement, Injectable, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, NgControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { itIgnore } from '../../../../tests/tests.helpers';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';

import { DateFormControlService } from '../common/providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { TestContext } from '../tests/helpers.spec';
import { FuiDate } from './date';
import { MockDatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service.mock';
import { DatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { DayModel } from '../datepicker/model/day.model';
import { DatepickerFocusService } from '../datepicker/providers/datepicker-focus.service';
import { FuiDateModule } from './date.module';
import { FuiDatepickerModule } from '../datepicker/datepicker.module';
import { FuiDateContainer } from './date-container';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

export default function() {
  describe('Date Input Component', () => {
    let context: TestContext<FuiDate, TestComponent>;
    let enabledService: MockDatepickerEnabledService;
    let dateIOService: DateIOService;
    let dateNavigationService: DateNavigationService;
    let dateFormControlService: DateFormControlService;
    let focusService: FocusService;
    let datepickerFocusService: DatepickerFocusService;
    const setControlSpy = jasmine.createSpy();

    @Injectable()
    class MockNgControlService extends NgControlService {
      // @ts-ignore
      setControl = setControlSpy;
    }

    describe('Basics', () => {
      beforeEach(function() {
        TestBed.overrideComponent(FuiDateContainer, {
          set: {
            providers: [{ provide: DatepickerEnabledService, useClass: MockDatepickerEnabledService }],
          },
        });

        context = this.create(FuiDate, TestComponent, [
          ControlClassService,
          { provide: NgControlService, useClass: MockNgControlService },
          NgControl,
          IfErrorService,
          IfOpenService,
          FocusService,
          DatepickerFocusService,
          DateNavigationService,
          LocaleHelperService,
          DateIOService,
          ControlIdService,
          DateFormControlService,
          FuiFormLayoutService,
        ]);

        enabledService = <MockDatepickerEnabledService>(
          context.fixture.debugElement.query(By.directive(FuiDateContainer)).injector.get(DatepickerEnabledService)
        );
        dateIOService = context.fixture.debugElement.query(By.directive(FuiDateContainer)).injector.get(DateIOService);
        dateNavigationService = context.fixture.debugElement
          .query(By.directive(FuiDateContainer))
          .injector.get(DateNavigationService);
        focusService = context.fixture.debugElement.injector.get(FocusService);
        datepickerFocusService = context.fixture.debugElement.injector.get(DatepickerFocusService);
        spyOn(datepickerFocusService, 'focusInput');
      });

      describe('View', () => {
        beforeEach(() => {
          context.detectChanges();
        });

        it('should apply the correct host classes', () => {
          expect(context.feruiElement.classList).toContain('fui-input-date');
        });

        it('should set the control on NgControlService', () => {
          expect(setControlSpy).toHaveBeenCalled();
        });

        it('should handle focus and blur events', () => {
          let focusState;
          const sub = focusService.focusChange.subscribe(state => (focusState = state));
          expect(focusState).toEqual(false);
          context.feruiElement.dispatchEvent(new Event('focus'));
          context.feruiElement.value = 'abc';
          context.detectChanges();
          expect(focusState).toEqual(true);
          context.feruiElement.dispatchEvent(new Event('input'));
          context.feruiElement.dispatchEvent(new Event('blur'));
          context.detectChanges();
          expect(focusState).toEqual(false);
          sub.unsubscribe();
        });
      });

      describe('Typescript API', () => {
        it('gets the placeholder from the IO service', () => {
          // since we are testing with en-US
          expect(context.feruiDirective.placeholderAttr).toBe(dateIOService.placeholderText);
        });

        it('does not override placeholder provided by the user', () => {
          context.feruiDirective.placeholderAttr = 'Test';
          expect(context.feruiDirective.placeholderAttr).toBe('Test');
        });

        it('gets whether the datepicker is enabled or not', () => {
          expect(enabledService.isEnabled).toBe(true);
          expect(context.feruiDirective.inputType).toBe('text');

          enabledService.fakeIsEnabled = false;
          expect(enabledService.isEnabled).toBe(false);

          context.detectChanges();
          expect(context.feruiDirective.inputType).toBe('date');
        });

        it('sets the selectedDay if the value of the input is valid', () => {
          const testEl: HTMLInputElement = <HTMLInputElement>document.createElement('INPUT');
          testEl.value = '01/02/2015';

          expect(dateNavigationService.selectedDay).toBeUndefined();

          context.feruiDirective.onValueChange(testEl);
          expect(dateNavigationService.selectedDay).toEqual(new DayModel(2015, 0, 2));
        });

        it('sets the selectedDay to a null if the value of the input is invalid', () => {
          const testEl: HTMLInputElement = <HTMLInputElement>document.createElement('INPUT');
          testEl.value = '01/02/201';

          expect(dateNavigationService.selectedDay).toBeUndefined();
          context.feruiDirective.onValueChange(testEl);

          expect(dateNavigationService.selectedDay).toBeUndefined();
        });

        it('outputs the date when the user selects a Date from the Date Picker', () => {
          expect(context.testComponent.date).toBeUndefined();

          dateNavigationService.notifySelectedDayChanged(new DayModel(2015, 1, 1));

          expect(context.testComponent.date.getFullYear()).toBe(2015);
          expect(context.testComponent.date.getMonth()).toBe(1);
          expect(context.testComponent.date.getDate()).toBe(1);
        });

        it('outputs the date when the user changes the date manually in th input', () => {
          expect(context.testComponent.date).toBeUndefined();

          const input: HTMLInputElement = context.testElement.querySelector('input');
          input.value = '01/01/2015';
          input.dispatchEvent(new Event('change'));

          expect(context.testComponent.date.getFullYear()).toBe(2015);
          expect(context.testComponent.date.getMonth()).toBe(0);
          expect(context.testComponent.date.getDate()).toBe(1);

          input.value = '01/01/201';
          input.dispatchEvent(new Event('change'));

          expect(context.testComponent.date).toBe(null);
        });
      });

      describe('Date Display', () => {
        it('displays the date on the input when the selectedDay is updated', () => {
          dateNavigationService.notifySelectedDayChanged(new DayModel(2015, 1, 1));
          expect(context.feruiElement.value).toBe('02/01/2015');

          dateNavigationService.notifySelectedDayChanged(new DayModel(2018, 5, 1));
          expect(context.feruiElement.value).toBe('06/01/2018');
        });

        it('calls the DateIOService toLocaleDisplayFormatString method to display the selectedDay', () => {
          spyOn(dateIOService, 'toLocaleDisplayFormatString');
          dateNavigationService.notifySelectedDayChanged(new DayModel(2015, 1, 1));
          expect(dateIOService.toLocaleDisplayFormatString).toHaveBeenCalled();
        });
      });

      describe('Host Bindings & Listeners', () => {
        it('binds the placeholderText to the placeholder of the input', () => {
          expect(context.feruiElement.placeholder).toBe('MM/DD/YYYY');
        });

        // Ignore Safari and IE here because it silently disallows setting to `date` types
        // since it is not supported.
        itIgnore(['safari', 'ie'], 'binds the input type correctly', () => {
          expect(context.feruiElement.type).toBe('text');

          enabledService.fakeIsEnabled = false;
          context.detectChanges();

          expect(context.feruiElement.type).toBe('date');
        });

        it('listens to the input change events', () => {
          spyOn(context.feruiDirective, 'onValueChange');

          const inputEl = context.fixture.debugElement.query(By.directive(FuiDate));
          inputEl.triggerEventHandler('change', inputEl);

          expect(context.feruiDirective.onValueChange).toHaveBeenCalled();
        });
      });
    });

    describe('Date input with ngModel', () => {
      let fixture: ComponentFixture<TestComponentWithNgModel>;
      let dateContainerDebugElement: DebugElement;
      let dateInputDebugElement: DebugElement;

      beforeEach(function() {
        TestBed.configureTestingModule({
          imports: [FormsModule, FuiDateModule, FuiDatepickerModule],
          declarations: [TestComponentWithNgModel],
        });

        fixture = TestBed.createComponent(TestComponentWithNgModel);
        fixture.detectChanges();
        dateContainerDebugElement = fixture.debugElement.query(By.directive(FuiDateContainer));
        dateInputDebugElement = fixture.debugElement.query(By.directive(FuiDate));
        dateNavigationService = dateContainerDebugElement.injector.get(DateNavigationService);
      });

      it('updates the selectedDay when the app changes the ngModel value', fakeAsync(() => {
        fixture.componentInstance.dateValue = '01/02/2015';

        fixture.detectChanges();
        tick();

        expect(dateInputDebugElement.nativeElement.value).toBe('01/02/2015');
        expect(dateNavigationService.selectedDay).toEqual(new DayModel(2015, 0, 2));

        fixture.componentInstance.dateValue = '05/05/2015';

        fixture.detectChanges();
        tick();

        expect(dateInputDebugElement.nativeElement.value).toBe('05/05/2015');
        expect(dateNavigationService.selectedDay).toEqual(new DayModel(2015, 4, 5));
      }));

      it('updates the model and the input element when selectedDay updated notification is received', () => {
        expect(fixture.componentInstance.dateValue).toBeUndefined();

        dateNavigationService.notifySelectedDayChanged(new DayModel(2015, 1, 1));

        fixture.detectChanges();

        expect(dateInputDebugElement.nativeElement.value).toBe('02/01/2015');
        expect(fixture.componentInstance.dateValue).toBe('02/01/2015');
      });

      it('allows you to reset the model', fakeAsync(() => {
        fixture.componentInstance.dateValue = '01/02/2015';
        fixture.detectChanges();
        tick();

        expect(dateInputDebugElement.nativeElement.value).toBe('01/02/2015');
        expect(dateNavigationService.selectedDay).toEqual(new DayModel(2015, 0, 2));

        fixture.nativeElement.querySelector('#reset').click();
        fixture.detectChanges();
        tick();

        expect(dateInputDebugElement.nativeElement.value).toBe('');
        expect(dateNavigationService.selectedDay).toEqual(null);

        fixture.componentInstance.dateValue = '01/02/2015';
        fixture.detectChanges();
        tick();

        expect(dateInputDebugElement.nativeElement.value).toBe('01/02/2015');
        expect(dateNavigationService.selectedDay).toEqual(new DayModel(2015, 0, 2));
      }));

      // IE doesn't handle Event constructor
      itIgnore(
        ['ie'],
        'updates the model and the selectedDay when the changes the input field',
        fakeAsync(() => {
          dateInputDebugElement.nativeElement.value = '01/02/2015';
          dateInputDebugElement.nativeElement.dispatchEvent(new Event('change'));

          fixture.detectChanges();
          tick();

          expect(dateNavigationService.selectedDay).toEqual(new DayModel(2015, 0, 2));
        })
      );
    });

    describe('Date input with Reactive Forms', () => {
      let fixture: ComponentFixture<TestComponentWithReactiveForms>;

      let dateContainerDebugElement: DebugElement;
      let dateInputDebugElement: DebugElement;

      beforeEach(function() {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule, FuiDateModule, FuiDatepickerModule],
          declarations: [TestComponentWithReactiveForms],
        });

        fixture = TestBed.createComponent(TestComponentWithReactiveForms);
        fixture.detectChanges();
        dateContainerDebugElement = fixture.debugElement.query(By.directive(FuiDateContainer));
        dateInputDebugElement = fixture.debugElement.query(By.directive(FuiDate));
        dateNavigationService = dateContainerDebugElement.injector.get(DateNavigationService);
        dateFormControlService = dateContainerDebugElement.injector.get(DateFormControlService);
      });

      it('initializes the input and the selected day with the value set by the user', () => {
        expect(fixture.componentInstance.testForm.get('date').value).not.toBeNull();

        expect(dateInputDebugElement.nativeElement.value).toBe(fixture.componentInstance.dateInput);
        expect(dateNavigationService.selectedDay.year).toBe(2015);
        expect(dateNavigationService.selectedDay.month).toBe(0);
        expect(dateNavigationService.selectedDay.date).toBe(1);
      });

      it('updates the input and the selected day when the value is updated by the user', () => {
        fixture.componentInstance.testForm.setValue({ date: '05/05/2018' });

        expect(dateInputDebugElement.nativeElement.value).toBe('05/05/2018');
        expect(dateNavigationService.selectedDay.year).toBe(2018);
        expect(dateNavigationService.selectedDay.month).toBe(4);
        expect(dateNavigationService.selectedDay.date).toBe(5);
      });

      it('outputs the date when the user manually changes the date', () => {
        const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
        let date: Date = fixture.componentInstance.dateOutput;

        expect(date).toBeUndefined();
        inputEl.value = '01/01/2012';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        date = fixture.componentInstance.dateOutput;

        expect(date.getFullYear()).toBe(2012);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(1);

        inputEl.value = '01/01/201';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        date = fixture.componentInstance.dateOutput;

        expect(date).toBeNull();
      });

      it('marks the form as touched when the markAsTouched event is received', () => {
        const date = fixture.componentInstance.testForm.get('date');
        expect(date.touched).toBe(false);

        dateFormControlService.markAsTouched();

        expect(date.touched).toBe(true);
      });

      it('marks the form as dirty when the markAsDirty event is received', () => {
        const date = fixture.componentInstance.testForm.get('date');
        expect(date.dirty).toBe(false);

        dateFormControlService.markAsDirty();

        expect(date.dirty).toBe(true);
      });
    });

    describe('Date input with Template Driven Forms', () => {
      let fixture: ComponentFixture<TestComponentWithTemplateDrivenForms>;
      let dateContainerDebugElement: DebugElement;

      beforeEach(function() {
        TestBed.configureTestingModule({
          imports: [FormsModule, FuiDateModule, FuiDatepickerModule],
          declarations: [TestComponentWithTemplateDrivenForms],
        });
        fixture = TestBed.createComponent(TestComponentWithTemplateDrivenForms);
        fixture.detectChanges();

        dateContainerDebugElement = fixture.debugElement.query(By.directive(FuiDateContainer));
        dateFormControlService = dateContainerDebugElement.injector.get(DateFormControlService);
      });

      it('marks the form as touched when the markAsTouched event is received', done => {
        fixture.whenStable().then(() => {
          const form = fixture.componentInstance.templateForm.form;
          expect(form.get('date').touched).toBe(false);

          dateFormControlService.markAsTouched();

          fixture.detectChanges();
          expect(form.get('date').touched).toBe(true);
          done();
        });
      });

      it('marks the form as dirty when the markAsDirty event is received', done => {
        fixture.whenStable().then(() => {
          const form = fixture.componentInstance.templateForm.form;
          expect(form.get('date').dirty).toBe(false);

          dateFormControlService.markAsDirty();

          fixture.detectChanges();
          expect(form.get('date').dirty).toBe(true);
          done();
        });
      });

      it('outputs the date when the user manually changes the date', () => {
        const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
        let date: Date = fixture.componentInstance.dateOutput;

        expect(date).toBeUndefined();
        inputEl.value = '01/01/2012';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        date = fixture.componentInstance.dateOutput;

        expect(date.getFullYear()).toBe(2012);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(1);

        inputEl.value = '01/01/201';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        date = fixture.componentInstance.dateOutput;

        expect(date).toBeNull();
      });
    });
  });
}

@Component({
  template: `
    <input type="date" fuiDate (fuiDateChange)="dateChanged($event)" class="test-class" />
  `,
})
class TestComponent {
  date: Date;

  dateChanged(date: Date) {
    this.date = date;
  }
}

@Component({
  template: `
    <input type="date" fuiDate [(ngModel)]="dateValue" #picker="ngModel" />
    <button id="reset" (click)="picker.reset()">Reset</button>
  `,
})
class TestComponentWithNgModel {
  dateValue: string;
  @ViewChild(FuiDate) dateInputInstance: FuiDate;
}

@Component({
  template: `
    <form [formGroup]="testForm">
      <input id="dateControl" type="date" fuiDate (fuiDateChange)="dateChanged($event)" formControlName="date" />
    </form>
  `,
})
class TestComponentWithReactiveForms {
  dateInput: string = '01/01/2015';
  testForm = new FormGroup({ date: new FormControl(this.dateInput) });

  dateOutput: Date;

  dateChanged(date: Date) {
    this.dateOutput = date;
  }
}

@Component({
  template: `
    <form #templateForm="ngForm">
      <input type="date" fuiDate (fuiDateChange)="dateChanged($event)" [(ngModel)]="dateInput" name="date" />
    </form>
  `,
})
class TestComponentWithTemplateDrivenForms {
  @ViewChild('templateForm') templateForm: NgForm;
  dateInput: string = '01/01/2015';
  dateOutput: Date;

  dateChanged(date: Date) {
    this.dateOutput = date;
  }
}
