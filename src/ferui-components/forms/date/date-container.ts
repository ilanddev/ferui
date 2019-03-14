import { Component, ContentChild, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';

import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { NgControlService } from '../common/providers/ng-control.service';

import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { FuiLabel } from '../common/label';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { FocusService } from '../common/providers/focus.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { DatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service';

@Component({
  selector: 'fui-date-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-date-wrapper">
        <ng-content select="label" *ngIf="label"></ng-content>
        <label *ngIf="!label"></label>
        <ng-content select="[fuiDate]"></ng-content>
        <div class="fui-date-icon-wrapper" *ngIf="isEnabled()">
          <clr-icon shape="fui-calendar" (click)="toggleDatepicker($event)" class="fui-input-group-icon-action"></clr-icon>
        </div>
        <fui-datepicker-view-manager *fuiIfOpen fuiFocusTrap></fui-datepicker-view-manager>
        <label class="fui-control-icons">
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
          <clr-icon *ngIf="!invalid && control?.value" class="fui-validate-icon" shape="fui-tick" aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  providers: [
    ControlIdService,
    IfErrorService,
    ControlClassService,
    NgControlService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    IfOpenService,
    DateIOService,
    DateNavigationService,
    DateFormControlService,
    LocaleHelperService,
    DatepickerEnabledService,
  ],
  host: {
    '[class.fui-form-control-disabled]': 'control?.disabled',
    '[class.fui-form-control]': 'true',
  },
})
export class FuiDateContainer implements DynamicWrapper, OnInit, OnDestroy {
  _dynamic: boolean = false;
  invalid: boolean = false;
  control: NgControl;

  @ContentChild(FuiLabel) label: FuiLabel;

  private focus: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService,
    private focusService: FocusService,
    private ifOpenService: IfOpenService,
    private dateNavigationService: DateNavigationService,
    private dateFormControlService: DateFormControlService,
    private datepickerEnabledService: DatepickerEnabledService
  ) {
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        if (control) {
          this.control = control;
        }
      })
    );
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        if (!this.ifOpenService.open) {
          this.focus = state;
          this.toggleDatepicker(null);
        }
      })
    );
    this.subscriptions.push(
      this.ifOpenService.openChange.subscribe(open => {
        if (open) {
          this.focus = true;
          this.initializeCalendar();
        } else {
          this.focus = false;
        }
      })
    );
  }

  isEnabled(): boolean {
    return this.datepickerEnabledService.isEnabled;
  }

  /**
   * Toggles the Datepicker Popover.
   */
  toggleDatepicker(event: MouseEvent) {
    if (this.isEnabled()) {
      this.ifOpenService.toggleWithEvent(event);
      this.dateFormControlService.markAsTouched();
    }
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.control, this.label, this.focus)
    );
  }

  ngOnInit(): void {}

  /**
   * Unsubscribe from subscriptions.
   */
  ngOnDestroy() {
    this.subscriptions.map(sub => sub.unsubscribe());
  }

  /**
   * Processes the user input and Initializes the Calendar every-time the datepicker popover is open.
   */
  private initializeCalendar(): void {
    this.dateNavigationService.initializeCalendar();
  }
}
