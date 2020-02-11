import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';

import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '../../utils/key-codes/key-codes';

import { YearRangeModel } from './model/year-range.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { ViewManagerService } from './providers/view-manager.service';
import { FuiCommonStrings } from '../../utils/i18n/common-strings.service';
import { DateNavigationService } from '../date/providers/date-navigation.service';
import { LocaleHelperService } from './providers/locale-helper.service';

@Component({
  selector: 'fui-yearpicker',
  template: `
    <div class="calendar-header">
      <div class="calendar-pickers">
        <button class="calendar-btn monthpicker-trigger" type="button" (click)="changeToMonthView()">
          {{ calendarMonth }}
        </button>
        <button class="calendar-btn yearpicker-trigger" type="button" (click)="changeToYearView()">
          {{ calendarYear }}
        </button>
      </div>
      <div class="calendar-switchers">
        <button class="calendar-btn switcher" type="button" (click)="previousDecade()">
          <clr-icon class="fui-calendar-arrows" shape="fui-caret" dir="left" [attr.title]="commonStrings.previous"></clr-icon>
        </button>
        <button class="calendar-btn switcher" type="button" (click)="currentDecade()">
          <clr-icon shape="fui-calendar" class="fui-calendar-icon has-badge" [attr.title]="commonStrings.current"></clr-icon>
        </button>
        <button class="calendar-btn switcher" type="button" (click)="nextDecade()">
          <clr-icon class="fui-calendar-arrows" shape="fui-caret" dir="right" [attr.title]="commonStrings.next"></clr-icon>
        </button>
      </div>
    </div>
    <div class="year-wrapper">
      <button
        *ngFor="let year of yearRangeModel.yearRange"
        type="button"
        class="calendar-btn year"
        [attr.tabindex]="getTabIndex(year)"
        [class.is-selected]="year === calendarYear"
        (click)="changeYear(year)"
      >
        {{ year }}
      </button>
    </div>
  `,
  host: {
    '[class.yearpicker]': 'true'
  }
})
export class FuiYearpicker implements AfterViewInit {
  /**
   * YearRangeModel which is used to build the YearPicker view.
   */
  yearRangeModel: YearRangeModel;

  /**
   * Keeps track of the current focused year.
   */
  private focusedYear: number;

  /**
   * Gets the year which the user is currently on.
   */
  get calendarYear(): number {
    return this.dateNavigationService.displayedCalendar.year;
  }

  /**
   * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
   */
  get calendarMonth(): string {
    return this.localeHelperService.localeMonthsAbbreviated[this.dateNavigationService.displayedCalendar.month];
  }

  constructor(
    private dateNavigationService: DateNavigationService,
    private viewManagerService: ViewManagerService,
    private datepickerFocusService: DatepickerFocusService,
    private elRef: ElementRef,
    public commonStrings: FuiCommonStrings,
    private localeHelperService: LocaleHelperService
  ) {
    this.yearRangeModel = new YearRangeModel(this.calendarYear);
    this.focusedYear = this.calendarYear;
  }

  /**
   * Calls the ViewManagerService to change to the monthpicker view.
   */
  changeToMonthView(): void {
    this.viewManagerService.changeToMonthView();
  }

  /**
   * Calls the ViewManagerService to change to the yearpicker view.
   */
  changeToYearView(): void {
    this.viewManagerService.changeToYearView();
  }

  /**
   * Calls the DateNavigationService to update the year value of the calendar.
   * Also changes the view to the daypicker.
   */
  changeYear(year: number): void {
    this.dateNavigationService.changeYear(year);
    this.viewManagerService.changeToDayView();
  }

  /**
   * Updates the YearRangeModel to the previous decade.
   */
  previousDecade(): void {
    this.yearRangeModel = this.yearRangeModel.previousDecade();
    // Year in the yearpicker is not focused because while navigating to a different decade,
    // you want the focus to remain on the decade switcher arrows.
  }

  /**
   * Updates the YearRangeModel to the current decade.
   */
  currentDecade(): void {
    if (!this.yearRangeModel.inRange(this.dateNavigationService.today.year)) {
      this.yearRangeModel = this.yearRangeModel.currentDecade();
    }
    this.datepickerFocusService.focusCell(this.elRef);
  }

  /**
   * Updates the YearRangeModel to the next decade.
   */
  nextDecade(): void {
    this.yearRangeModel = this.yearRangeModel.nextDecade();
    // Year in the yearpicker is not focused because while navigating to a different decade,
    // you want the focus to remain on the decade switcher arrows.
  }

  /**
   * Compares the year passed to the focused year and returns the tab index.
   */
  getTabIndex(year: number): number {
    if (!this.yearRangeModel.inRange(this.focusedYear)) {
      if (this.yearRangeModel.inRange(this.calendarYear)) {
        this.focusedYear = this.calendarYear;
      } else {
        this.focusedYear = this.yearRangeModel.middleYear;
      }
    }
    return this.focusedYear === year ? 0 : -1;
  }

  /**
   * Handles the Keyboard arrow navigation for the yearpicker.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // NOTE: Didn't move this to the date navigation service because
    // the logic is fairly simple and it didn't make sense for me
    // to create extra observables just to move this logic to the service.
    if (event) {
      const keyCode: number = event.keyCode;
      if (keyCode === UP_ARROW) {
        event.preventDefault();
        this.incrementFocusYearBy(-1);
      } else if (keyCode === DOWN_ARROW) {
        event.preventDefault();
        this.incrementFocusYearBy(1);
      } else if (keyCode === RIGHT_ARROW) {
        event.preventDefault();
        this.incrementFocusYearBy(6);
      } else if (keyCode === LEFT_ARROW) {
        event.preventDefault();
        this.incrementFocusYearBy(-6);
      }
    }
  }

  /**
   * Focuses on the current calendar year when the View is initialized.
   */
  ngAfterViewInit() {
    this.datepickerFocusService.focusCell(this.elRef);
  }

  /**
   * Increments the focus year by the value passed. Updates the YearRangeModel if the
   * new value is not in the current decade.
   */
  private incrementFocusYearBy(value: number): void {
    this.focusedYear = this.focusedYear + value;
    if (!this.yearRangeModel.inRange(this.focusedYear)) {
      if (value > 0) {
        this.yearRangeModel = this.yearRangeModel.nextDecade();
      } else {
        this.yearRangeModel = this.yearRangeModel.previousDecade();
      }
    }
    this.datepickerFocusService.focusCell(this.elRef);
  }
}
