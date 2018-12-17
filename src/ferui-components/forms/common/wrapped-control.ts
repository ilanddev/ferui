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
import { Renderer2 } from '@angular/core';

export class WrappedFormControl<W extends DynamicWrapper> implements OnInit, OnDestroy {
  private ngControlService: NgControlService;
  private ifErrorService: IfErrorService;
  private controlClassService: ControlClassService;
  private markControlService: MarkControlService;
  private placeholderService: PlaceholderService;

  protected subscriptions: Subscription[] = [];
  protected index = 0;
  protected controlIdService: ControlIdService;

  _id: string;

  constructor(
    protected vcr: ViewContainerRef,
    protected wrapperType: Type<W>,
    injector: Injector,
    private ngControl: NgControl,
    renderer: Renderer2,
    el: ElementRef
  ) {
    try {
      this.ngControlService = injector.get(NgControlService);
      this.ifErrorService = injector.get(IfErrorService);
      this.controlClassService = injector.get(ControlClassService);
      this.markControlService = injector.get(MarkControlService);
      this.placeholderService = injector.get(PlaceholderService);
    } catch (e) {}

    if (this.controlClassService) {
      this.controlClassService.initControlClass(renderer, el.nativeElement);
    }
    if (this.markControlService) {
      this.subscriptions.push(
        this.markControlService.dirtyChange.subscribe(() => {
          this.ngControl.control.markAsDirty();
          this.ngControl.control.updateValueAndValidity();
        })
      );
    }
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
  placeholderAttr: string;

  @HostBinding('attr.required')
  @Input('required')
  requiredAttr: boolean;

  @HostListener('blur')
  triggerValidation() {
    if (this.ifErrorService) {
      this.ifErrorService.triggerStatusChange();
    }
  }

  private _containerInjector: Injector;

  ngOnInit() {
    this._containerInjector = new HostWrapper(this.wrapperType, this.vcr, this.index);
    this.controlIdService = this._containerInjector.get(ControlIdService);
    if (this._id) {
      this.controlIdService.id = this._id;
    } else {
      this._id = this.controlIdService.id;
    }

    if (this.ngControlService) {
      this.ngControlService.setControl(this.ngControl);
    }

    if (this.placeholderService) {
      this.placeholderService.setPlaceholder(this.placeholderAttr);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
