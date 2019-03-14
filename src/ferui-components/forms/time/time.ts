import {
  Directive,
  Optional,
  ViewContainerRef,
  ElementRef,
  Injector,
  Self,
  Input,
  HostBinding,
  Inject,
  PLATFORM_ID,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TimeIOService } from './providers/time-io.service';
import { TimeModel } from './models/time.model';
import { TimeSelectionService } from './providers/time-selection.service';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { AbstractDateTime } from '../common/abstract-date-time';
import { DateFormControlService } from '../common/providers/date-form-control.service';
import { filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FuiTimeContainer } from './time-container';

@Directive({
  selector: '[fuiTime]',
  host: {
    '[class.fui-time]': 'true',
  },
})
export class FuiTime extends AbstractDateTime<FuiTimeContainer> implements OnInit, AfterViewInit, OnDestroy {
  protected index = 1;

  /**
   * Sets the input type to text when the datepicker is enabled. Reverts back to the native date input
   * when the datepicker is disabled. Datepicker is disabled on mobiles.
   */
  @HostBinding('attr.type')
  get inputType(): string {
    return isPlatformBrowser(this.platformId) ? 'text' : 'time';
  }

  @Input('fuiTime')
  set modelType(modelType: FuiDatetimeModelTypes) {
    if (modelType === FuiDatetimeModelTypes.STRING || modelType === FuiDatetimeModelTypes.DATE) {
      this._modelType = modelType;
    }
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    protected renderer: Renderer2,
    protected el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Self()
    @Optional()
    protected control: NgControl,
    @Optional() protected container: FuiTimeContainer,
    @Optional() protected iOService: TimeIOService,
    @Optional() protected timeSelectionService: TimeSelectionService,
    @Optional() private dateFormControlService: DateFormControlService
  ) {
    super(vcr, FuiTimeContainer, injector, control, renderer, el);
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

  /**
   * 1. Populate services if the date container is not present.
   * 2. Initialize Subscriptions.
   * 3. Process User Input.
   */
  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();
    this.subscriptions.push(
      this.listenForSelectedTimeChanges(),
      this.listenForControlValueChanges(),
      this.listenForTouchChanges(),
      this.listenForDirtyChanges()
    );
  }

  ngAfterViewInit() {
    this.processInitialInputs();
  }

  protected resetControl() {
    this.timeSelectionService.notifySelectedTime(null);
  }

  /**
   * Populates the services from the container component.
   */
  private populateServicesFromContainerComponent(): void {
    if (!this.container) {
      this.iOService = this.getProviderFromContainer(TimeIOService);
      this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
      this.timeSelectionService = this.getProviderFromContainer(TimeSelectionService);
    }
  }

  private listenForSelectedTimeChanges() {
    return this.timeSelectionService.selectedTimeChange.subscribe((timeModel: TimeModel) => {
      if (timeModel) {
        this.updateDate(timeModel.toDate(), true);
      }
    });
  }

  private listenForControlValueChanges() {
    return of(this.dateInputHasFormControl())
      .pipe(filter(hasControl => hasControl), switchMap(() => this.control.valueChanges))
      .subscribe((value: string) => {
        this.updateDate(this.iOService.getDateValueFromDateOrString(value));
      });
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
