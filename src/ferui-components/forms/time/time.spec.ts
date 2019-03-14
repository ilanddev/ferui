import { TestContext } from '../tests/helpers.spec';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { FocusService } from '../common/providers/focus.service';
import { Component, DebugElement, Injectable, ViewChild } from '@angular/core';
import { NgControlService } from '../common/providers/ng-control.service';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FuiTimeContainer } from './time-container';
import { ControlClassService } from '../common/providers/control-class.service';
import { FormControl, FormGroup, FormsModule, NgControl, NgForm, ReactiveFormsModule } from '@angular/forms';
import { IfErrorService } from '../common/if-error/if-error.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { By } from '@angular/platform-browser';
import { itIgnore } from '../../../../tests/tests.helpers';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { TimeIOService } from './providers/time-io.service';
import { TimeSelectionService } from './providers/time-selection.service';
import { FuiTime } from './time';
import { TimeModel } from './models/time.model';
import { FuiTimeModule } from './time.module';

export default function() {
  describe('Time Input Component', () => {
    let context: TestContext<FuiTime, TestComponent>;
    let timeIOService: TimeIOService;
    let timeSelectionService: TimeSelectionService;
    let dateFormControlService: DateFormControlService;
    let focusService: FocusService;
    const setControlSpy = jasmine.createSpy();

    @Injectable()
    class MockNgControlService extends NgControlService {
      // @ts-ignore
      setControl = setControlSpy;
    }

    describe('Basics', () => {
      beforeEach(function() {
        context = this.create(FuiTime, TestComponent, [
          ControlClassService,
          { provide: NgControlService, useClass: MockNgControlService },
          NgControl,
          IfErrorService,
          FocusService,
          LocaleHelperService,
          ControlIdService,
          DateFormControlService,
          PlaceholderService,
          RequiredControlService,
          TimeIOService,
          TimeSelectionService,
        ]);

        timeIOService = context.fixture.debugElement.query(By.directive(FuiTimeContainer)).injector.get(TimeIOService);
        timeSelectionService = context.fixture.debugElement
          .query(By.directive(FuiTimeContainer))
          .injector.get(TimeSelectionService);
        focusService = context.fixture.debugElement.injector.get(FocusService);
      });

      describe('View', () => {
        beforeEach(() => {
          context.detectChanges();
        });

        it('should apply the correct host classes', () => {
          expect(context.feruiElement.classList).toContain('fui-time');
        });

        it('should set the control on NgControlService', () => {
          expect(setControlSpy).toHaveBeenCalled();
        });
      });

      describe('Typescript API', () => {
        it('outputs the time when the user selects a time from selects', () => {
          expect(context.testComponent.time).toBeUndefined();

          timeSelectionService.notifySelectedTime(new TimeModel(10, 0, 0));

          expect(context.testComponent.time.getHours()).toBe(10);
          expect(context.testComponent.time.getMinutes()).toBe(0);
          expect(context.testComponent.time.getSeconds()).toBe(0);
        });
      });

      describe('Time Display', () => {
        it('displays the time on the input', () => {
          timeSelectionService.notifySelectedTime(new TimeModel(10, 0, 0));
          expect(context.feruiElement.value).toBe('10:00:00 AM');

          timeSelectionService.notifySelectedTime(new TimeModel(16, 20, 0));
          expect(context.feruiElement.value).toBe('4:20:00 PM');
        });

        it('calls the TimeIOService toLocaleDisplayFormatString method to display the selected time', () => {
          spyOn(timeIOService, 'toLocaleDisplayFormatString');
          timeSelectionService.notifySelectedTime(new TimeModel(10, 0, 0));
          expect(timeIOService.toLocaleDisplayFormatString).toHaveBeenCalled();
        });
      });

      describe('Host Bindings & Listeners', () => {
        it('listens to the input change events', () => {
          spyOn(context.feruiDirective, 'onValueChange');

          const inputEl = context.fixture.debugElement.query(By.directive(FuiTime));
          inputEl.triggerEventHandler('change', inputEl);

          expect(context.feruiDirective.onValueChange).toHaveBeenCalled();
        });
      });
    });

    describe('Time input with ngModel', () => {
      let fixture: ComponentFixture<TestComponentWithNgModel>;
      let timeContainerDebugElement: DebugElement;
      let timeInputDebugElement: DebugElement;

      beforeEach(function() {
        TestBed.configureTestingModule({
          imports: [FormsModule, FuiTimeModule],
          declarations: [TestComponentWithNgModel],
        });

        fixture = TestBed.createComponent(TestComponentWithNgModel);
        fixture.detectChanges();

        timeContainerDebugElement = fixture.debugElement.query(By.directive(FuiTimeContainer));
        timeInputDebugElement = fixture.debugElement.query(By.directive(FuiTime));
        timeSelectionService = timeContainerDebugElement.injector.get(TimeSelectionService);
      });

      it(
        'updates the selects models when the app changes the ngModel value',
        fakeAsync(() => {
          fixture.componentInstance.timeValue = '10:00:30 PM';

          fixture.detectChanges();
          tick();

          expect(timeInputDebugElement.nativeElement.value).toBe('10:00:30 PM');
          expect(timeSelectionService.selectedTime).toEqual(new TimeModel(22, 0, 30));

          fixture.componentInstance.timeValue = '5:10:00 AM';

          fixture.detectChanges();
          tick();

          expect(timeInputDebugElement.nativeElement.value).toBe('5:10:00 AM');
          expect(timeSelectionService.selectedTime).toEqual(new TimeModel(5, 10, 0));
        })
      );

      it('updates the model and the input element when timeSelection updated notification is received', () => {
        expect(fixture.componentInstance.timeValue).toBeUndefined();

        timeSelectionService.notifySelectedTime(new TimeModel(14, 0, 0));

        fixture.detectChanges();

        expect(timeInputDebugElement.nativeElement.value).toBe('2:00:00 PM');
        expect(fixture.componentInstance.timeValue).toBe('2:00:00 PM');
      });

      it(
        'allows you to reset the model',
        fakeAsync(() => {
          fixture.componentInstance.timeValue = '10:00:30 PM';
          fixture.detectChanges();
          tick();

          expect(timeInputDebugElement.nativeElement.value).toBe('10:00:30 PM');
          expect(timeSelectionService.selectedTime).toEqual(new TimeModel(22, 0, 30));

          fixture.nativeElement.querySelector('#reset').click();
          fixture.detectChanges();
          tick();

          expect(timeInputDebugElement.nativeElement.value).toBe('');
          expect(timeSelectionService.selectedTime).toEqual(null);

          fixture.componentInstance.timeValue = '5:00:00 AM';
          fixture.detectChanges();
          tick();

          expect(timeInputDebugElement.nativeElement.value).toBe('5:00:00 AM');
          expect(timeSelectionService.selectedTime).toEqual(new TimeModel(5, 0, 0));
        })
      );

      // IE doesn't handle Event constructor
      itIgnore(
        ['ie'],
        'updates the model and the selectedTime when the changes the input field',
        fakeAsync(() => {
          timeInputDebugElement.nativeElement.value = '5:00:00 AM';
          timeInputDebugElement.nativeElement.dispatchEvent(new Event('change'));

          fixture.detectChanges();
          tick();

          expect(timeSelectionService.selectedTime).toEqual(new TimeModel(5, 0, 0));
        })
      );
    });

    describe('Time input with Reactive Forms', () => {
      let fixture: ComponentFixture<TestComponentWithReactiveForms>;

      let timeContainerDebugElement: DebugElement;
      let timeInputDebugElement: DebugElement;

      beforeEach(function() {
        TestBed.configureTestingModule({
          imports: [ReactiveFormsModule, FuiTimeModule],
          declarations: [TestComponentWithReactiveForms],
        });

        fixture = TestBed.createComponent(TestComponentWithReactiveForms);
        fixture.detectChanges();
        timeContainerDebugElement = fixture.debugElement.query(By.directive(FuiTimeContainer));
        timeInputDebugElement = fixture.debugElement.query(By.directive(FuiTime));
        timeSelectionService = timeContainerDebugElement.injector.get(TimeSelectionService);
        dateFormControlService = timeContainerDebugElement.injector.get(DateFormControlService);
      });

      it('initializes the input and the selected time with the value set by the user', () => {
        expect(fixture.componentInstance.testForm.get('time').value).not.toBeNull();

        expect(timeInputDebugElement.nativeElement.value).toBe(fixture.componentInstance.dateInput);
        expect(timeSelectionService.selectedTime.hour).toBe(22);
        expect(timeSelectionService.selectedTime.minute).toBe(0);
        expect(timeSelectionService.selectedTime.second).toBe(0);
      });

      it('updates the input and the selected time when the value is updated by the user', () => {
        fixture.componentInstance.testForm.setValue({ time: '5:00:00 AM' });

        expect(timeInputDebugElement.nativeElement.value).toBe('5:00:00 AM');
        expect(timeSelectionService.selectedTime.hour).toBe(5);
        expect(timeSelectionService.selectedTime.minute).toBe(0);
        expect(timeSelectionService.selectedTime.second).toBe(0);
      });

      it('outputs the time when the user manually changes the time', () => {
        const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
        let time: Date = fixture.componentInstance.dateOutput;

        expect(time).toBeUndefined();
        inputEl.value = '7:30:00 PM';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        time = fixture.componentInstance.dateOutput;

        expect(time.getHours()).toBe(19);
        expect(time.getMinutes()).toBe(30);
        expect(time.getSeconds()).toBe(0);

        inputEl.value = '5:30:55 test';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        time = fixture.componentInstance.dateOutput;

        expect(time).toBeNull();
      });

      it('marks the form as touched when the markAsTouched event is received', () => {
        const time = fixture.componentInstance.testForm.get('time');
        expect(time.touched).toBe(false);

        dateFormControlService.markAsTouched();

        expect(time.touched).toBe(true);
      });

      it('marks the form as dirty when the markAsDirty event is received', () => {
        const time = fixture.componentInstance.testForm.get('time');
        expect(time.dirty).toBe(false);

        dateFormControlService.markAsDirty();

        expect(time.dirty).toBe(true);
      });
    });

    describe('Time input with Template Driven Forms', () => {
      let fixture: ComponentFixture<TestComponentWithTemplateDrivenForms>;
      let timeContainerDebugElement: DebugElement;

      beforeEach(function() {
        TestBed.configureTestingModule({
          imports: [FormsModule, FuiTimeModule],
          declarations: [TestComponentWithTemplateDrivenForms],
        });
        fixture = TestBed.createComponent(TestComponentWithTemplateDrivenForms);
        fixture.detectChanges();

        timeContainerDebugElement = fixture.debugElement.query(By.directive(FuiTimeContainer));
        dateFormControlService = timeContainerDebugElement.injector.get(DateFormControlService);
      });

      it('marks the form as touched when the markAsTouched event is received', done => {
        fixture.whenStable().then(() => {
          const form = fixture.componentInstance.templateForm.form;
          expect(form.get('time').touched).toBe(false);

          dateFormControlService.markAsTouched();

          fixture.detectChanges();
          expect(form.get('time').touched).toBe(true);
          done();
        });
      });

      it('marks the form as dirty when the markAsDirty event is received', done => {
        fixture.whenStable().then(() => {
          const form = fixture.componentInstance.templateForm.form;
          expect(form.get('time').dirty).toBe(false);

          dateFormControlService.markAsDirty();

          fixture.detectChanges();
          expect(form.get('time').dirty).toBe(true);
          done();
        });
      });

      it('outputs the time when the user manually changes the time', () => {
        const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
        let time: Date = fixture.componentInstance.dateOutput;

        expect(time).toBeUndefined();
        inputEl.value = '8:00:00 PM';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        time = fixture.componentInstance.dateOutput;

        expect(time.getHours()).toBe(20);
        expect(time.getMinutes()).toBe(0);
        expect(time.getSeconds()).toBe(0);

        inputEl.value = '2:00:00 test';
        inputEl.dispatchEvent(new Event('change'));
        fixture.detectChanges();

        time = fixture.componentInstance.dateOutput;

        expect(time).toBeNull();
      });
    });
  });
}

@Component({
  template: `<input type="time" step="1" fuiTime (fuiDateChange)="dateChanged($event)" class="test-class">`,
})
class TestComponent {
  time: Date;

  dateChanged(date: Date) {
    this.time = date;
  }
}

@Component({
  template: `
    <input type="time" step="1" fuiTime [(ngModel)]="timeValue" #picker="ngModel">
    <button id="reset" (click)="picker.reset()">Reset</button>
  `,
})
class TestComponentWithNgModel {
  timeValue: string;

  @ViewChild(FuiTime) timeInputInstance: FuiTime;
}

@Component({
  template: `
    <form [formGroup]="testForm">
      <input id="dateControl" type="time" step="1" fuiTime (fuiDateChange)="dateChanged($event)" formControlName="time">
    </form>
  `,
})
class TestComponentWithReactiveForms {
  dateInput: string = '10:00:00 PM';
  testForm = new FormGroup({ time: new FormControl(this.dateInput) });

  dateOutput: Date;

  dateChanged(date: Date) {
    this.dateOutput = date;
  }
}

@Component({
  template: `
    <form #templateForm="ngForm">
      <input type="time" step="1" fuiTime (fuiDateChange)="dateChanged($event)" [(ngModel)]="dateInput" name="time">
    </form>
  `,
})
class TestComponentWithTemplateDrivenForms {
  @ViewChild('templateForm') templateForm: NgForm;
  dateInput: string = '10:00:00 PM';
  dateOutput: Date;

  dateChanged(date: Date) {
    this.dateOutput = date;
  }
}
