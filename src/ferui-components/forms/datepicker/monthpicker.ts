import { AfterViewInit, Component, ElementRef, HostListener } from '@angular/core';

import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '../../utils/key-codes/key-codes';

import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { DateNavigationService } from '../date/providers/date-navigation.service';

@Component({
  selector: 'fui-monthpicker',
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
    </div>
    <div class="month-wrapper">
      <button
        type="button"
        class="calendar-btn month"
        *ngFor="let month of monthNames; let monthIndex = index"
        (click)="changeMonth(monthIndex)"
        [class.is-selected]="monthIndex === calendarMonthIndex"
        [attr.tabindex]="getTabIndex(monthIndex)"
      >
        {{ month }}
      </button>
    </div>
  `,
  host: {
    '[class.monthpicker]': 'true'
  }
})
export class FuiMonthpicker implements AfterViewInit {
  /**
   * Keeps track of the current focused month.
   */
  private focusedMonthIndex: number;

  /**
   * Gets the months array which is used to rendered the monthpicker view.
   * Months are in the TranslationWidth.Wide format.
   */
  get monthNames(): ReadonlyArray<string> {
    return this.localeHelperService.localeMonthsWide;
  }

  /**
   * Gets the month value of the Calendar.
   */
  get calendarMonthIndex(): number {
    return this.dateNavigationService.displayedCalendar.month;
  }

  /**
   * Returns the month value of the calendar in the TranslationWidth.Abbreviated format.
   */
  get calendarMonth(): string {
    return this.localeHelperService.localeMonthsAbbreviated[this.dateNavigationService.displayedCalendar.month];
  }

  /**
   * Returns the year value of the calendar.
   */
  get calendarYear(): number {
    return this.dateNavigationService.displayedCalendar.year;
  }

  constructor(
    private viewManagerService: ViewManagerService,
    private localeHelperService: LocaleHelperService,
    private dateNavigationService: DateNavigationService,
    private datepickerFocusService: DatepickerFocusService,
    private elRef: ElementRef
  ) {
    this.focusedMonthIndex = this.calendarMonthIndex;
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
   * Calls the DateNavigationService to update the month value of the calendar.
   * Also changes the view to the daypicker.
   */
  changeMonth(monthIndex: number) {
    this.dateNavigationService.changeMonth(monthIndex);
    this.viewManagerService.changeToDayView();
  }

  /**
   * Compares the month passed to the focused month and returns the tab index.
   */
  getTabIndex(monthIndex: number): number {
    return monthIndex === this.focusedMonthIndex ? 0 : -1;
  }

  /**
   * Handles the Keyboard arrow navigation for the monthpicker.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // NOTE: Didn't move this to the date navigation service because
    // the logic is fairly simple and it didn't make sense for me
    // to create extra observables just to move this logic to the service.
    if (event) {
      const keyCode: number = event.keyCode;
      if (keyCode === UP_ARROW && this.focusedMonthIndex > 0) {
        event.preventDefault();
        this.focusedMonthIndex--;
        this.datepickerFocusService.focusCell(this.elRef);
      } else if (keyCode === DOWN_ARROW && this.focusedMonthIndex < 11) {
        event.preventDefault();
        this.focusedMonthIndex++;
        this.datepickerFocusService.focusCell(this.elRef);
      } else if (keyCode === RIGHT_ARROW && this.focusedMonthIndex < 6) {
        event.preventDefault();
        this.focusedMonthIndex = this.focusedMonthIndex + 6;
        this.datepickerFocusService.focusCell(this.elRef);
      } else if (keyCode === LEFT_ARROW && this.focusedMonthIndex > 5) {
        event.preventDefault();
        this.focusedMonthIndex = this.focusedMonthIndex - 6;
        this.datepickerFocusService.focusCell(this.elRef);
      }
    }
  }

  /**
   * Focuses on the current calendar month when the View is initialized.
   */
  ngAfterViewInit() {
    this.datepickerFocusService.focusCell(this.elRef);
  }
}
