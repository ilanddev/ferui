import { Component, ContentChild, Inject, InjectionToken, Input, OnDestroy, AfterContentInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';

import { IfErrorService } from '../common/if-error/if-error.service';

import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { FocusService } from '../common/providers/focus.service';
import { FuiLabel } from '../common/label';
import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { PasswordReference } from './password-reference';

/* tslint:disable-next-line:variable-name */
export const ToggleService = new InjectionToken<any>(undefined);

/* tslint:disable-next-line:variable-name */
export function ToggleServiceProvider() {
  return new BehaviorSubject<boolean>(false);
}

@Component({
  selector: 'fui-password-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-input-wrapper">
        <ng-content select="label" *ngIf="label"></ng-content>
        <label *ngIf="!label"></label>
        
        <clr-icon *ngIf="!show && fuiToggle"
                  shape="fui-eye"
                  class="fui-input-group-icon-action"
                  (click)="toggle()"></clr-icon>
        <clr-icon *ngIf="show && fuiToggle"
                  shape="fui-eye-off"
                  class="fui-input-group-icon-action"
                  (click)="toggle()"></clr-icon>
        
        <ng-content select="[fuiPassword]"></ng-content>
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
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    FocusService,
    { provide: ToggleService, useFactory: ToggleServiceProvider },
  ],
})
export class FuiPasswordContainer implements DynamicWrapper, AfterContentInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  invalid = false;
  control: NgControl;
  _dynamic = false;
  show = false;
  focus = false;
  private _toggle = true;

  @Input('fuiToggle')
  set fuiToggle(state: boolean) {
    this._toggle = state;
    if (!state) {
      this.show = false;
    }
  }

  get fuiToggle() {
    return this._toggle;
  }

  @ContentChild(FuiLabel) label: FuiLabel;
  @ContentChild(PasswordReference) injectedControl: PasswordReference;

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    public focusService: FocusService,
    private ngControlService: NgControlService,
    @Inject(ToggleService) private toggleService: BehaviorSubject<boolean>
  ) {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      })
    );
  }

  toggle() {
    this.show = !this.show;
    this.toggleService.next(this.show);
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
