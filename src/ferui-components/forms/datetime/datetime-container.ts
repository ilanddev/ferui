import { AfterContentInit, Component, ContentChild, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';

import { IfErrorService } from '../common/if-error/if-error.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiLabel } from '../common/label';
import { ControlClassService } from '../common/providers/control-class.service';
import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { FocusService } from '../common/providers/focus.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { DatetimeIOService } from './providers/datetime-io.service';
import { DatetimeFormControlService } from './providers/datetime-form-control.service';
import { TimeIOService } from '../time/providers/time-io.service';
import { DateIOService } from '../date/providers/date-io.service';
import { FuiTime } from '../time/time';
import { FuiDate } from '../date/date';

export interface DatetimeInterface {
  date: Date;
  time: Date;
}

@Component({
  selector: 'fui-datetime-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-datetime-wrapper clearfix"
           [class.fui-datetime-4]="_numberOfControls === 4"
           [class.fui-datetime-3]="_numberOfControls === 3"
           [class.fui-datetime-2]="_numberOfControls === 2">

        <ng-content select="label" *ngIf="label"></ng-content>
        <label *ngIf="!label"></label>
        <ng-content select="[fuiDatetime]"></ng-content>

        <fui-date-container>
          <input type="date" [fuiDate]="_dateModelType"
                 [(ngModel)]="model.date"
                 (fuiDateChange)="childModelChange('date', $event)"/>
        </fui-date-container>
        <fui-time-container [showHours]="showHours" [showMinutes]="showMinutes" [showSeconds]="showSeconds"
                            [twentyFourHourFormat]="twentyFourHourFormat">
          <input type="time" [fuiTime]="_dateModelType"
                 [(ngModel)]="model.time"
                 (fuiDateChange)="childModelChange('time', $event)"/>
        </fui-time-container>

        <label class="fui-control-icons">
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
          <clr-icon *ngIf="!invalid && control?.value" class="fui-validate-icon" shape="fui-tick"
                    aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  providers: [
    ControlIdService,
    LocaleHelperService,
    IfErrorService,
    ControlClassService,
    FocusService,
    RequiredControlService,
    NgControlService,
    DateFormControlService,
    PlaceholderService,
    DatetimeIOService,
    DatetimeFormControlService,
  ],
  host: {
    '[class.fui-form-control-disabled]': 'control?.disabled',
    '[class.fui-form-control]': 'true',
  },
})
export class FuiDatetimeContainer implements DynamicWrapper, OnInit, OnDestroy {
  _dynamic = false;
  _numberOfControls: number = 4;
  _dateModelType: FuiDatetimeModelTypes = FuiDatetimeModelTypes.DATE;
  control: NgControl;
  invalid = false;

  @ContentChild(FuiLabel) label: FuiLabel;
  @ViewChild(FuiTime) fuiTime: FuiTime;
  @ViewChild(FuiDate) fuiDate: FuiDate;

  modelType: FuiDatetimeModelTypes;
  model: DatetimeInterface = {
    date: null,
    time: null,
  };

  @Input() twentyFourHourFormat: boolean = false;
  @Input() showHours: boolean = true;
  @Input() showMinutes: boolean = true;
  @Input() showSeconds: boolean = true;

  private focus: boolean = false;
  private initialFocus: boolean = true;
  // When a user manually focus the field or using tab.
  private userFocused: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService,
    private focusService: FocusService,
    private requiredService: RequiredControlService,
    private datetimeIOService: DatetimeIOService,
    private dateFormControlService: DateFormControlService,
    private datetimeFormControlService: DatetimeFormControlService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
        if (state) {
          if (!this.userFocused) {
            this.fuiDate.focusService.focused = true;
          }
          this.dateFormControlService.markAsTouched();
        } else if (!this.initialFocus) {
          if (this.ifErrorService) {
            this.ifErrorService.triggerStatusChange();
          }
        }
        this.initialFocus = false;
        this.userFocused = false;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        if (control) {
          this.control = control;
          this.subscriptions.push(
            this.control.valueChanges.subscribe((value: string | Date) => {
              const datetime: Date = value instanceof Date ? value : value ? new Date(value) : null;
              this.initModels(datetime);
            })
          );
        }
      })
    );
    this.subscriptions.push(
      this.datetimeFormControlService.modelTypeChange.subscribe((modelType: FuiDatetimeModelTypes) => {
        this.modelType = modelType;
      })
    );
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.control, this.label, this.focus)
    );
  }

  childModelChange(type: string, value: Date): void {
    if (!type || !value) {
      return null;
    }
    const currentDate: Date | string = this.control.control.value || '';
    const datetime: Date = currentDate instanceof Date ? currentDate : new Date(currentDate);
    if (type === 'date') {
      datetime.setDate(value.getDate());
      datetime.setMonth(value.getMonth());
      datetime.setFullYear(value.getFullYear());
    } else {
      datetime.setHours(value.getHours());
      datetime.setMinutes(value.getMinutes());
      datetime.setSeconds(value.getSeconds());
    }
    this.writeControlValue(datetime);
  }

  ngOnInit(): void {
    if (!this.showHours) {
      this._numberOfControls--;
    }
    if (!this.showMinutes) {
      this._numberOfControls--;
    }
    if (!this.showSeconds) {
      this._numberOfControls--;
    }
    if (this._numberOfControls === 1) {
      this._numberOfControls = 2;
    }

    if (this.fuiTime && this.fuiTime.focusService) {
      this.subscriptions.push(
        this.fuiTime.focusService.focusChange.subscribe((state: boolean) => {
          this.userFocused = true;
          this.focusService.focused = state;
        })
      );
    }
    if (this.fuiDate && this.fuiDate.focusService) {
      this.subscriptions.push(
        this.fuiDate.focusService.focusChange.subscribe((state: boolean) => {
          this.userFocused = true;
          this.focusService.focused = state;
        })
      );
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
  }

  private initModels(datetime: Date): void {
    this.model.date = datetime;
    this.model.time = datetime;
  }

  private writeControlValue(value: Date): void {
    if (this.control) {
      this.dateFormControlService.markAsDirty();
      if (this.modelType === FuiDatetimeModelTypes.DATE) {
        this.control.valueAccessor.writeValue(value);
        this.control.control.setValue(value);
      } else {
        const dateStr: string = this.datetimeIOService.toLocaleDisplayFormatString(value);
        this.control.valueAccessor.writeValue(dateStr);
        this.control.control.setValue(dateStr);
      }
    }
  }
}
