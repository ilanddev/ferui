import { ElementRef, EventEmitter, Injector, OnInit, Output, Renderer2, Type, ViewContainerRef } from '@angular/core';
import { FuiDatetimeModelTypes } from './datetime-model-types.enum';
import { NgControl } from '@angular/forms';
import { WrappedFormControl } from './wrapped-control';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { DatetimeIoInterface } from './datetime-io-interface';
import { DayModel } from '../datepicker/model/day.model';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { datesAreEqual, timesAreEqual } from '../datepicker/utils/date-utils';
import { TimeSelectionService } from '../time/providers/time-selection.service';
import { TimeModel } from '../time/models/time.model';
import { DateIOService } from '../date/providers/date-io.service';
import { TimeIOService } from '../time/providers/time-io.service';
import { DatetimeIOService } from '../datetime/providers/datetime-io.service';

export abstract class AbstractDateTime<W extends DynamicWrapper> extends WrappedFormControl<W> implements OnInit {
  @Output('fuiDateChange') dateChange: EventEmitter<Date> = new EventEmitter<Date>(false);
  protected _modelType: FuiDatetimeModelTypes = FuiDatetimeModelTypes.STRING;
  protected previousDateChange: Date;
  protected iOService: DatetimeIoInterface;
  protected dateNavigationService: DateNavigationService;
  protected timeSelectionService: TimeSelectionService;

  protected constructor(
    protected vcr: ViewContainerRef,
    protected wrapperType: Type<W>,
    private injector: Injector,
    protected control: NgControl,
    protected renderer: Renderer2,
    protected el: ElementRef
  ) {
    super(vcr, wrapperType, injector, control, renderer, el);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected dateInputHasFormControl() {
    return !!this.control;
  }

  protected processInitialInputs(): void {
    if (this.dateInputHasFormControl() && this.iOService) {
      this.updateDate(this.iOService.getDateValueFromDateOrString(this.control.value));
    }
  }

  protected getValidDateValueFromDate(date: Date): Date {
    if (this.iOService) {
      const dateString = this.iOService.toLocaleDisplayFormatString(date);
      return this.iOService.getDateValueFromDateOrString(dateString);
    } else {
      return null;
    }
  }

  protected emitDateOutput(date: Date) {
    if (
      (this.iOService instanceof DateIOService && !datesAreEqual(date, this.previousDateChange)) ||
      (this.iOService instanceof TimeIOService && !timesAreEqual(date, this.previousDateChange)) ||
      (this.iOService instanceof DatetimeIOService &&
        !datesAreEqual(date, this.previousDateChange) &&
        !timesAreEqual(date, this.previousDateChange))
    ) {
      this.dateChange.emit(date);
      this.previousDateChange = date;
    } else if (!date && this.previousDateChange) {
      this.dateChange.emit(null);
      this.previousDateChange = null;
    }
  }

  protected updateDate(value: Date, setByUserInteraction = false): void {
    const date: Date = this.getValidDateValueFromDate(value);
    if (setByUserInteraction) {
      this.emitDateOutput(date);
    } else {
      this.previousDateChange = date;
    }

    if (this.dateNavigationService) {
      this.dateNavigationService.selectedDay = date ? new DayModel(date.getFullYear(), date.getMonth(), date.getDate()) : null;
    }
    if (this.timeSelectionService) {
      this.timeSelectionService.selectedTime = date ? new TimeModel(date.getHours(), date.getMinutes(), date.getSeconds()) : null;
    }

    this.updateInput(date);
  }

  protected updateInput(date: Date): void {
    if (date) {
      const dateString = this.iOService.toLocaleDisplayFormatString(date);
      const controlValueString = this.dateInputHasFormControl()
        ? this.iOService.toLocaleDisplayFormatString(this.iOService.getDateValueFromDateOrString(this.control.value))
        : null;

      if (this.dateInputHasFormControl() && dateString !== controlValueString) {
        if (dateString !== this.control.value) {
          this.control.control.setValue(this._modelType === FuiDatetimeModelTypes.DATE ? date : dateString);
        }
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'value', dateString);
      }
    } else {
      this.resetControl();
    }
  }

  protected resetControl() {
    this.renderer.setProperty(this.el.nativeElement, 'value', '');
  }
}
