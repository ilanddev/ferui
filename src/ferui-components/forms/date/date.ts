import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  PLATFORM_ID,
  Renderer2,
  Self,
  ViewContainerRef
} from '@angular/core';
import { NgControl } from '@angular/forms';

import { DateFormControlService } from '../common/providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { DatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service';
import { FuiDatetimeModelTypes } from '../common/datetime-model-types.enum';
import { AbstractDateTime } from '../common/abstract-date-time';
import { filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { DatepickerFocusService } from '../datepicker/providers/datepicker-focus.service';
import { FuiDateContainer } from './date-container';

@Directive({
  selector: '[fuiDate]',
  host: {
    '[class.fui-input-date]': 'true',
    '[class.fui-layout-small]': 'layout === fuiFormLayoutEnum.SMALL'
  },
  providers: [DatepickerFocusService]
})
export class FuiDate extends AbstractDateTime<FuiDateContainer> implements OnInit, AfterViewInit, OnDestroy {
  @Input('fuiDate')
  set modelType(modelType: FuiDatetimeModelTypes) {
    if (modelType === FuiDatetimeModelTypes.STRING || modelType === FuiDatetimeModelTypes.DATE) {
      this._modelType = modelType;
    }
  }

  /**
   * Returns the date format for the placeholder according to which the input should be entered by the user.
   */
  @HostBinding('attr.placeholder')
  @Input('placeholder')
  set placeholderAttr(value: string) {
    this._placeholder = value;
  }

  get placeholderAttr() {
    return this._placeholder ? this._placeholder : this.iOService ? this.iOService.placeholderText : '';
  }

  protected index = 1;

  /**
   * Sets the input type to text when the datepicker is enabled. Reverts back to the native date input
   * when the datepicker is disabled. Datepicker is disabled on mobiles.
   */
  @HostBinding('attr.type')
  get inputType(): string {
    const isDatepickerService = this.datepickerEnabledService && this.datepickerEnabledService.isEnabled;
    return isPlatformBrowser(this.platformId) && isDatepickerService ? 'text' : 'date';
  }

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    protected el: ElementRef,
    renderer: Renderer2,
    @Self()
    @Optional()
    protected control: NgControl,
    protected datepickerFocusService: DatepickerFocusService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() protected iOService: DateIOService,
    @Optional() protected dateNavigationService: DateNavigationService,
    @Optional() protected container: FuiDateContainer,
    @Optional() private datepickerEnabledService: DatepickerEnabledService,
    @Optional() private dateFormControlService: DateFormControlService
  ) {
    super(vcr, FuiDateContainer, injector, control, renderer, el);
  }

  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();
    this.subscriptions.push(
      this.listenForUserSelectedDayChanges(),
      this.listenForControlValueChanges(),
      this.listenForTouchChanges(),
      this.listenForDirtyChanges()
    );
  }

  ngAfterViewInit(): void {
    this.processInitialInputs();
  }

  /**
   * Fires this method when the user changes the input focuses out of the input field.
   */
  @HostListener('change', ['$event.target'])
  onValueChange(target: HTMLInputElement) {
    const validDateValue: Date = this.iOService.getDateValueFromDateOrString(target.value);
    if (validDateValue) {
      this.updateDate(validDateValue, true);
    } else {
      this.emitDateOutput(null);
    }
  }

  /**
   * Populates the services from the container component.
   */
  private populateServicesFromContainerComponent(): void {
    if (!this.container) {
      this.iOService = this.getProviderFromContainer(DateIOService);
      this.dateNavigationService = this.getProviderFromContainer(DateNavigationService);
      this.datepickerEnabledService = this.getProviderFromContainer(DatepickerEnabledService);
      this.dateFormControlService = this.getProviderFromContainer(DateFormControlService);
    }
  }

  private listenForControlValueChanges() {
    return of(this.dateInputHasFormControl())
      .pipe(
        filter(hasControl => hasControl),
        switchMap(() => this.control.valueChanges),
        // only update date value if not being set by user
        filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement))
      )
      .subscribe((value: string) => this.updateDate(this.iOService.getDateValueFromDateOrString(value)));
  }

  private listenForUserSelectedDayChanges() {
    return this.dateNavigationService.selectedDayChange.subscribe(dayModel => this.updateDate(dayModel.toDate(), true));
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
