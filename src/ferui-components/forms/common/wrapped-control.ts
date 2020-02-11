import {
  HostBinding,
  HostListener,
  Injector,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
  ElementRef,
  OnDestroy,
  Renderer2,
  InjectionToken
} from '@angular/core';

import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';

import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';
import { IfErrorService } from './if-error/if-error.service';
import { NgControl } from '@angular/forms';
import { ControlClassService } from './providers/control-class.service';
import { MarkControlService } from './providers/mark-control.service';
import { Subscription } from 'rxjs';
import { PlaceholderService } from './providers/placeholder.service';
import { FocusService } from './providers/focus.service';
import { RequiredControlService } from './providers/required-control.service';
import { filter } from 'rxjs/operators';
import { FuiFormLayoutEnum } from './layout.enum';
import { FuiFormLayoutService } from './providers/form-layout.service';

export class WrappedFormControl<W extends DynamicWrapper> implements OnInit, OnDestroy {
  fuiFormLayoutEnum = FuiFormLayoutEnum;
  focusService: FocusService;
  formLayoutService: FuiFormLayoutService;

  protected subscriptions: Subscription[] = [];
  protected index = 0;
  protected _required: boolean;
  protected _placeholder: string;
  protected _layout: FuiFormLayoutEnum = FuiFormLayoutEnum.DEFAULT;

  private _id: string;
  private controlIdService: ControlIdService;
  private requiredService: RequiredControlService;
  private ngControlService: NgControlService;
  private ifErrorService: IfErrorService;
  private controlClassService: ControlClassService;
  private markControlService: MarkControlService;
  private placeholderService: PlaceholderService;
  private containerInjector: Injector;

  private controlClassServiceInit: boolean = false;
  private markControlServiceInit: boolean = false;

  constructor(
    protected vcr: ViewContainerRef,
    protected wrapperType: Type<W>,
    injector: Injector,
    private ngControl: NgControl,
    protected renderer: Renderer2,
    protected el: ElementRef
  ) {
    try {
      // If we wrap the control with a container, we have all providers loaded already.
      this.ngControlService = injector.get(NgControlService);
      this.ifErrorService = injector.get(IfErrorService);
      this.controlClassService = injector.get(ControlClassService);
      this.markControlService = injector.get(MarkControlService);
      this.placeholderService = injector.get(PlaceholderService);
      this.focusService = injector.get(FocusService);
      this.requiredService = injector.get(RequiredControlService);
      this.formLayoutService = injector.get(FuiFormLayoutService);
    } catch (e) {}
    this.init();
  }

  @HostBinding()
  @Input()
  get id() {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
    if (this.controlIdService) {
      this.controlIdService.id = value;
    }
  }

  @HostBinding('attr.placeholder')
  @Input('placeholder')
  set placeholderAttr(value: string) {
    this._placeholder = value;
    if (this.placeholderService) {
      this.placeholderService.setPlaceholder(value);
    }
  }

  get placeholderAttr(): string {
    return this._placeholder;
  }

  @HostBinding('attr.required')
  @Input('required')
  set requiredAttr(value: string | boolean) {
    const hasRequiredAttribute: boolean = value === '' || value === 'true' || value === true;
    this._required = hasRequiredAttribute;
    if (this.requiredService) {
      this.requiredService.required = hasRequiredAttribute;
    }
  }

  get requiredAttr() {
    return this._required;
  }

  @Input()
  set layout(value: FuiFormLayoutEnum) {
    this._layout = value;
    if (this.formLayoutService) {
      this.formLayoutService.layout = value;
    }
  }

  get layout(): FuiFormLayoutEnum {
    if (this.formLayoutService) {
      return this.formLayoutService.layout;
    }
    return this._layout;
  }

  ngOnInit() {
    this.containerInjector = new HostWrapper(this.wrapperType, this.vcr, this.index);
    this.controlIdService = this.containerInjector.get(ControlIdService);
    // If we are creating the container (HostWrapper) dynamically,
    // we then need to retrieve the providers from this newly created parent.
    this.loadProvidersFromContainer();

    if (this.controlIdService) {
      if (this._id) {
        this.controlIdService.id = this._id;
      } else {
        this._id = this.controlIdService.id;
      }
    }

    if (this.ngControlService) {
      this.ngControlService.setControl(this.ngControl);
    }

    if (this.formLayoutService) {
      this.formLayoutService.layout = this._layout;
    }

    this.init();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  @HostListener('focus')
  setFocusStates() {
    this.setFocus(true);
  }

  @HostListener('blur')
  triggerValidation() {
    this.setFocus(false);
    if (this.ifErrorService) {
      this.ifErrorService.triggerStatusChange();
    }
  }

  protected getProviderFromContainer<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    try {
      return this.containerInjector.get(token, notFoundValue);
    } catch (e) {
      return notFoundValue;
    }
  }

  /**
   * @name loadServiceFromParent
   * @param service
   * @param token
   * @description If the service is not defined or null we then try to load the provider
   * from the newly created HostWrapper parent instead.
   */
  protected loadServiceFromParent<T>(service: T, token: Type<T> | InjectionToken<T>): T {
    if (!service) {
      service = this.getProviderFromContainer(token);
    }
    return service;
  }

  private loadProvidersFromContainer() {
    this.focusService = this.loadServiceFromParent(this.focusService, FocusService);
    this.requiredService = this.loadServiceFromParent(this.requiredService, RequiredControlService);
    this.ngControlService = this.loadServiceFromParent(this.ngControlService, NgControlService);
    this.ifErrorService = this.loadServiceFromParent(this.ifErrorService, IfErrorService);
    this.controlClassService = this.loadServiceFromParent(this.controlClassService, ControlClassService);
    this.markControlService = this.loadServiceFromParent(this.markControlService, MarkControlService);
    this.placeholderService = this.loadServiceFromParent(this.placeholderService, PlaceholderService);
    this.formLayoutService = this.loadServiceFromParent(this.formLayoutService, FuiFormLayoutService);
  }

  private init(): void {
    if (this.controlClassService && !this.controlClassServiceInit) {
      this.controlClassServiceInit = true;
      this.controlClassService.initControlClass(this.renderer, this.el.nativeElement);
    }
    if (this.markControlService && !this.markControlServiceInit) {
      this.markControlServiceInit = true;
      this.subscriptions.push(
        this.markControlService.dirtyChange.pipe(filter(() => this.hasControl())).subscribe(() => {
          this.ngControl.control.markAsDirty();
          this.ngControl.control.updateValueAndValidity();
        })
      );
    }
  }

  private hasControl(): boolean {
    return !!this.ngControl;
  }

  private setFocus(focus: boolean): void {
    if (this.focusService) {
      this.focusService.focused = focus;
    }
  }
}
