import { AfterContentInit, Component, OnInit } from '@angular/core';
import { IfErrorService } from '../common/if-error/if-error.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';
import { ContentChild } from '@angular/core';
import { FormControlClass } from '../../utils/form-control-class/form-control-class';
import { FuiLabel } from '../common/label';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { FocusService } from '../common/providers/focus.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { FuiSelectIcon } from './select-icon';
import { FuiSelectService } from './select.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';
import { FuiFormLayoutEnum } from '../common/layout.enum';

@Component({
  selector: 'fui-select-container',
  template: `
    <div class="fui-control-container" [ngClass]="controlClass()">
      <div class="fui-select-wrapper">
        <ng-content select="[fuiSelectIcon]"></ng-content>
        <ng-content select="[fuiSelect]"></ng-content>
        <ng-content select="label" *ngIf="label"></ng-content>
        <label *ngIf="!label"></label>
        <div class="select-arrow"></div>
        <label class="fui-control-icons">
          <clr-icon *ngIf="invalid" class="fui-error-icon is-red" shape="fui-error" aria-hidden="true"></clr-icon>
          <!--<clr-icon *ngIf="false" class="fui-validate-icon" shape="fui-tick"-->
          <!--aria-hidden="true"></clr-icon>-->
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
    '[class.fui-form-control-small]': 'controlLayout() === formLayoutService.fuiFormLayoutEnum.SMALL',
    '[class.fui-form-control-disabled]': 'control?.disabled',
    '[class.fui-select-icon]': 'selectIcon !== undefined',
  },
  providers: [
    IfErrorService,
    NgControlService,
    ControlIdService,
    ControlClassService,
    PlaceholderService,
    FocusService,
    RequiredControlService,
    FuiSelectService,
    FuiFormLayoutService,
  ],
})
export class FuiSelectContainer implements DynamicWrapper, OnInit, OnDestroy, AfterContentInit {
  invalid = false;
  _dynamic = false;
  control: NgControl;

  @ContentChild(FuiLabel) label: FuiLabel;
  @ContentChild(FuiSelectIcon) selectIcon: FuiSelectIcon;

  private placeholder: string = null;
  private focus: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private ifErrorService: IfErrorService,
    private controlClassService: ControlClassService,
    private ngControlService: NgControlService,
    private focusService: FocusService,
    private selectService: FuiSelectService,
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
      })
    );
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      })
    );
  }

  controlClass() {
    return this.controlClassService.controlClass(
      this.invalid,
      FormControlClass.extractControlClass(this.control, this.label, this.focus)
    );
  }

  ngOnInit(): void {
    this.selectService.fuiSelectContainer = this;
    if (this.label) {
      this.subscriptions.push(
        this.label.value.subscribe(value => {
          this.placeholder = value;
          if (this.selectService.fuiSelect && this.selectService.fuiSelect.hasNgSelect()) {
            this.selectService.fuiSelect.ngSelect.placeholder = this.placeholder;
          }
        }),
        this.label.focusChange.subscribe(focused => {
          if (this.selectService && this.selectService.fuiSelect.hasNgSelect()) {
            if (focused) {
              this.selectService.fuiSelect.ngSelect.open();
            }
          }
        })
      );
    }
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  ngAfterContentInit(): void {
    if (this.selectService && this.selectService.fuiSelect.hasNgSelect()) {
      if (this.placeholder) {
        this.selectService.fuiSelect.ngSelect.placeholder = this.placeholder;
      }
      let isNgSelectOpen: boolean = false;
      if (this.selectIcon) {
        this.subscriptions.push(
          this.selectIcon.onClick.subscribe(() => {
            if (isNgSelectOpen) {
              this.selectService.fuiSelect.ngSelect.close();
              this.selectIcon.clicked = false;
            } else {
              this.selectService.fuiSelect.ngSelect.open();
              this.selectIcon.clicked = true;
            }
          })
        );
      }

      this.subscriptions.push(
        this.selectService.fuiSelect.ngSelect.openEvent.subscribe(() => {
          isNgSelectOpen = true;
          this.focus = true;
          if (this.selectIcon) {
            this.selectIcon.focused = true;
          }
        })
      );
      this.subscriptions.push(
        this.selectService.fuiSelect.ngSelect.closeEvent.subscribe(() => {
          isNgSelectOpen = false;
          this.focus = false;
          if (this.selectIcon) {
            this.selectIcon.focused = false;
          }
        })
      );
    }
  }

  controlLayout(): FuiFormLayoutEnum {
    return this.formLayoutService.layout;
  }
}
