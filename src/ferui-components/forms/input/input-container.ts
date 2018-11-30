import { Component, ContentChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';

import { IfErrorService } from '../common/if-error/if-error.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { ControlIdService } from '../common/providers/control-id.service';
import { FuiLabel } from '../common/label';
import { ControlClassService } from '../common/providers/control-class.service';

@Component({
  selector: 'fui-input-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <ng-content select="label"></ng-content>
      <label *ngIf="!label"></label>
      <div class="fui-input-wrapper">
        <ng-content select="[fuiInput]"></ng-content>
        <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
        <clr-icon *ngIf="!invalid && control?.value" class="fui-validate-icon" shape="fui-tick" aria-hidden="true"></clr-icon>
        <ng-content select="fui-control-error" *ngIf="invalid"></ng-content>
      </div>
    </div>
  `,
  host: {
    '[class.fui-form-control]': 'true',
    '[class.fui-form-control-disabled]': 'control?.disabled'
  },
  providers: [IfErrorService, NgControlService, ControlIdService, ControlClassService]
})
export class FuiInputContainer implements DynamicWrapper, OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  _dynamic = false;
  @ContentChild(FuiLabel) label: FuiLabel;
  control: NgControl;

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
    return this.controlClassService.controlClass(this.invalid, this.extractControlClass());
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.map(sub => sub.unsubscribe());
    }
  }

  private extractControlClass(): Array<string> {
    const classes = [];
    if (this.control && this.control.touched) {
      classes.push('fui-touched');
    }
    if (this.control && this.control.dirty) {
      classes.push('fui-dirty');
    }
    if (this.control && this.control.disabled) {
      classes.push('fui-disabled');
    }
    if (this.control && this.control.pristine) {
      classes.push('fui-pristine');
    }
    if (this.control && !this.control.value) {
      classes.push('fui-empty');
    }
    if (!this.label) {
      classes.push('fui-no-label');
    }
    return classes;
  }
}
