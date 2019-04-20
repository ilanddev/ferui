import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
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
import { FocusService } from '../common/providers/focus.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { TimeIOService } from './providers/time-io.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { TimeSelectionService } from './providers/time-selection.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { FuiCommonStrings } from '../../utils/i18n/common-strings.service';
import { TimeModel } from './models/time.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { FuiFormLayoutEnum } from '../common/layout.enum';

export interface TimeInterface {
  hour: number;
  minute: number;
  second: number;
}

@Component({
  selector: 'fui-time-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div
        class="fui-time-wrapper"
        [class.fui-time-3]="_numberOfControls === 3"
        [class.fui-time-2]="_numberOfControls === 2"
        [class.fui-time-1]="_numberOfControls === 1"
      >
        <ng-content select="label" *ngIf="label"></ng-content>
        <label *ngIf="!label"></label>

        <ng-content select="[fuiTime]"></ng-content>

        <ng-select
          #selectElement
          *ngIf="showHours"
          [clearable]="false"
          [class.fui-select]="true"
          [placeholder]="commonStrings.hours"
          [items]="hoursList"
          (focus)="setFocusState()"
          (blur)="markControlAsTouched()"
          [(ngModel)]="model.hour"
          (change)="updateTime($event)"
        >
          <ng-template ng-option-tmp ng-label-tmp let-item="item">
            {{ formatHour(item) }}
          </ng-template>
        </ng-select>

        <ng-select
          #selectElement
          *ngIf="showMinutes"
          [clearable]="false"
          [class.fui-select]="true"
          [placeholder]="commonStrings.minutes"
          [items]="minutesList"
          (focus)="setFocusState()"
          (blur)="markControlAsTouched()"
          [(ngModel)]="model.minute"
          (change)="updateTime(null, $event)"
        >
          <ng-template ng-option-tmp ng-label-tmp let-item="item"> {{ item }} min</ng-template>
        </ng-select>

        <ng-select
          #selectElement
          *ngIf="showSeconds"
          [clearable]="false"
          [class.fui-select]="true"
          [placeholder]="commonStrings.seconds"
          [items]="secondsList"
          (focus)="setFocusState()"
          (blur)="markControlAsTouched()"
          [(ngModel)]="model.second"
          (change)="updateTime(null, null, $event)"
        >
          <ng-template ng-option-tmp ng-label-tmp let-item="item"> {{ item }} s</ng-template>
        </ng-select>

        <label class="fui-control-icons">
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
          <clr-icon
            *ngIf="!invalid && control?.value"
            class="fui-validate-icon"
            shape="fui-tick"
            aria-hidden="true"
          ></clr-icon>
        </label>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-select-container]': 'true',
    '[class.fui-form-control-disabled]': 'control?.disabled',
    '[class.fui-form-control-small]': 'controlLayout() === formLayoutService.fuiFormLayoutEnum.SMALL',
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    TimeIOService,
    LocaleHelperService,
    TimeSelectionService,
    DateFormControlService,
    FuiFormLayoutService,
  ],
})
export class FuiTimeContainer implements DynamicWrapper, AfterViewInit, OnInit, OnDestroy {
  _dynamic = false;
  _numberOfControls = 3;
  control: NgControl;
  invalid = false;

  model: TimeInterface = {
    hour: null,
    minute: null,
    second: null,
  };

  hoursList: Array<number> = [];
  minutesList: Array<number> = [];
  secondsList: Array<number> = [];

  @ContentChild(FuiLabel) label: FuiLabel;
  @ViewChildren('selectElement') selectElements: QueryList<NgSelectComponent>;

  @Input() twentyFourHourFormat: boolean = false;
  @Input() showHours: boolean = true;
  @Input() showMinutes: boolean = true;
  @Input() showSeconds: boolean = true;

  private focus: boolean = false;
  // When a user focus the field using a click on the select or by using tab.
  private selectFocus: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private el: ElementRef,
    public commonStrings: FuiCommonStrings,
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService,
    private focusService: FocusService,
    private timeIOService: TimeIOService,
    private timeSelectionService: TimeSelectionService,
    private dateFormControlService: DateFormControlService,
    public formLayoutService: FuiFormLayoutService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
        if (this.control) {
          this.subscriptions.push(
            this.control.valueChanges.subscribe((value: string | Date) => {
              this.updateSelects(this.getControlTime(value));
            })
          );
        }
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
        if (state === false && this.selectFocus) {
          this.dateFormControlService.markAsTouched();
          if (this.ifErrorService) {
            this.ifErrorService.triggerStatusChange();
          }
        }
        if (state === true && !this.selectFocus) {
          this.selectElements.first.open();
        }
        if (this.selectFocus) {
          this.selectFocus = false;
        }
      })
    );
    this.timeSelectionService.selectedTimeChange.subscribe((timeModel: TimeModel) => {
      this.updateSelects(timeModel);
    });
  }

  controlLayout(): FuiFormLayoutEnum {
    return this.formLayoutService.layout;
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.control, this.label, this.focus)
    );
  }

  updateTime(hour?: number, minute?: number, second?: number): void {
    const time: TimeModel = this.getControlTime();
    const h: number = hour !== null && hour !== undefined ? hour : time ? time.hour : 0;
    const m: number = minute !== null && minute !== undefined ? minute : time ? time.minute : 0;
    const s: number = second !== null && second !== undefined ? second : time ? time.second : 0;
    const timeModel = new TimeModel(h, m, s, time ? time.toDate() : null);
    this.timeSelectionService.notifySelectedTime(timeModel);
    this.dateFormControlService.markAsDirty();
  }

  formatHour(value: number): string {
    if (this.twentyFourHourFormat) {
      return ('0' + value).slice(-2) + ` h`;
    } else {
      const meridiem = value < 12 ? 'AM' : 'PM';
      const twelveFormat = value >= 13 ? value - 12 : value === 0 ? 12 : value;
      return ('0' + twelveFormat).slice(-2) + ` ${meridiem}`;
    }
  }

  setFocusState() {
    this.selectFocus = true;
    this.focusService.focused = true;
  }

  markControlAsTouched() {
    this.selectFocus = true;
    this.focusService.focused = false;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    // If we set all three attributes to false, we then only display the hours.
    if (!this.showHours && !this.showMinutes && !this.showSeconds) {
      this.showHours = true;
    }

    if (!this.showHours) {
      this._numberOfControls--;
    }
    if (!this.showMinutes) {
      this._numberOfControls--;
    }
    if (!this.showSeconds) {
      this._numberOfControls--;
    }

    if (this.showHours) {
      for (let h = 0; h < 24; h++) {
        this.hoursList[h] = h;
      }
    }
    if (this.showMinutes) {
      for (let m = 0; m < 60; m++) {
        this.minutesList[m] = m;
      }
    }
    if (this.showSeconds) {
      for (let s = 0; s < 60; s++) {
        this.secondsList[s] = s;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
  }

  private updateSelects(timeModel: TimeModel | null) {
    if (timeModel instanceof TimeModel) {
      this.model.hour = timeModel.hour;
      this.model.minute = timeModel.minute;
      this.model.second = timeModel.second;
    } else if (timeModel === null) {
      this.model.hour = null;
      this.model.minute = null;
      this.model.second = null;
    }
  }

  private getControlTime(value?: string | Date): TimeModel | null {
    if (this.control) {
      value = value || this.control.value;
      let date: Date;
      if (value instanceof Date) {
        date = value;
      } else if (value) {
        date = this.timeIOService.getDateValueFromDateOrString(value);
      }
      if (date instanceof Date) {
        return new TimeModel(date.getHours(), date.getMinutes(), date.getSeconds(), date);
      }
    }
    return null;
  }
}
