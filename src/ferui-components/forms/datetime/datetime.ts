import {
  Directive,
  ViewContainerRef,
  ElementRef,
  Injector,
  Self,
  Input,
  OnInit,
  OnDestroy,
  Optional,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { Renderer2 } from '@angular/core';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { AbstractDateTime } from '../common/abstract-date-time';
import { DatetimeIOService } from './providers/datetime-io.service';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { DatetimeFormControlService } from './providers/datetime-form-control.service';
import { FuiDatetimeContainer } from './datetime-container';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[fuiDatetime]',
  host: { '[class.fui-datetime]': 'true' },
})
export class FuiDatetime extends AbstractDateTime<FuiDatetimeContainer> implements AfterViewInit, OnInit, OnDestroy {
  protected index = 1;

  @Input('fuiDatetime')
  set modelType(modelType: FuiDatetimeModelTypes) {
    this._modelType = modelType;
    if (this.datetimeFormControlService) {
      this.datetimeFormControlService.setModelType(modelType);
    }
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    protected control: NgControl,
    renderer: Renderer2,
    el: ElementRef,
    @Optional() protected container: FuiDatetimeContainer,
    @Optional() protected iOService: DatetimeIOService,
    @Optional() private dateFormControlService: DateFormControlService,
    @Optional() private datetimeFormControlService: DatetimeFormControlService
  ) {
    super(vcr, FuiDatetimeContainer, injector, control, renderer, el);
  }

  @HostListener('change', ['$event.target'])
  onValueChange(target: HTMLInputElement) {
    const validDateValue = this.iOService.getDateValueFromDateOrString(target.value);
    if (validDateValue) {
      this.updateDate(validDateValue, true);
    } else {
      this.emitDateOutput(null);
    }
  }

  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();
    this.subscriptions.push(this.listenForTouchChanges(), this.listenForDirtyChanges());
  }

  ngAfterViewInit() {
    this.processInitialInputs();
  }

  /**
   * Populates the services from the container component.
   */
  private populateServicesFromContainerComponent(): void {
    if (!this.container) {
      this.iOService = this.getProviderFromContainer(DatetimeIOService);
      this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
      this.datetimeFormControlService = this.getProviderFromContainer(DatetimeFormControlService);
    }
  }

  private listenForTouchChanges() {
    return this.dateFormControlService.touchedChange
      .pipe(filter(() => this.dateInputHasFormControl()))
      .subscribe(() => this.control.control.markAsTouched());
  }

  private listenForDirtyChanges() {
    return this.dateFormControlService.dirtyChange
      .pipe(filter(() => this.dateInputHasFormControl()))
      .subscribe(() => this.control.control.markAsDirty());
  }
}
