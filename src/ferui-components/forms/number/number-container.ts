import { Component, ContentChild, OnDestroy } from '@angular/core';
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
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { FuiFormLayoutEnum } from '../common/layout.enum';
import { NumberIoService } from './providers/number-io.service';

@Component({
  selector: 'fui-number-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-input-wrapper">
        <ng-content select="label" *ngIf="label"></ng-content>
        <label *ngIf="!label"></label>

        <div class="input-number-wrapper">
          <ng-content select="[fuiNumber]"></ng-content>

          <div class="fui-number-increment-wrapper">
            <button class="fui-number-btn fui-number-increment" (click)="increment()">
              <clr-icon class="fui-number-icon" shape="fui-solid-arrow" aria-hidden="true"></clr-icon>
            </button>
            <button class="fui-number-btn fui-number-decrement" (click)="decrement()">
              <clr-icon class="fui-number-icon" flip="vertical" shape="fui-solid-arrow" aria-hidden="true"></clr-icon>
            </button>
          </div>
        </div>

        <label class="fui-control-icons">
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        </label>
        <fui-default-control-error [on]="invalid">
          <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
        </fui-default-control-error>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control-number]': 'true',
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-small]': 'controlLayout() === formLayoutService.fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'ngControl?.disabled'
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiFormLayoutService,
    NumberIoService
  ]
})
export class FuiNumberContainer implements DynamicWrapper, OnDestroy {
  _dynamic = false;
  invalid = false;
  ngControl: NgControl;

  @ContentChild(FuiLabel) label: FuiLabel;

  private focus: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService,
    private focusService: FocusService,
    public formLayoutService: FuiFormLayoutService,
    private numberIOService: NumberIoService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.ngControl = control;
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );
  }

  controlClass(): string {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.ngControl, this.label, this.focus)
    );
  }

  increment(): void {
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.ngControl.control.setValue(this.numberIOService.increment());
  }

  decrement(): void {
    if (this.ngControl && this.ngControl.disabled) {
      return;
    }
    this.ngControl.control.setValue(this.numberIOService.decrement());
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
  }

  controlLayout(): FuiFormLayoutEnum {
    return this.formLayoutService.layout;
  }
}
