import { Component } from '@angular/core';
import { IfErrorService } from '../common/if-error/if-error.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';
import { ContentChild } from '@angular/core';
import { SelectReference } from './select-reference';
import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { FuiLabel } from '../common/label';
import { AfterContentInit } from '@angular/core';
import { PlaceholderService } from '../common/providers/placeholder.service';

@Component({
  selector: 'fui-select-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-select-wrapper">
        <ng-content select="[fuiSelect]"></ng-content>
        <ng-content select="label" *ngIf="label"></ng-content>
        <div class="select-arrow"></div>
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
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-disabled]': 'control?.disabled',
  },
  providers: [IfErrorService, NgControlService, ControlIdService, ControlClassService, PlaceholderService],
})
export class FuiSelectContainer implements DynamicWrapper, AfterContentInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  _dynamic = false;
  control: NgControl;
  @ContentChild(FuiLabel) label: FuiLabel;
  @ContentChild(SelectReference) injectedControl: SelectReference;

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.control, this.label, this.injectedControl)
    );
  }

  ngAfterContentInit() {
    if (this.label && this.injectedControl) {
      this.label.setLabelRequired(this.injectedControl.required !== undefined);
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
  }
}
