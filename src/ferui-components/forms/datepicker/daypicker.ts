import { Component } from '@angular/core';

import { LocaleHelperService } from './providers/locale-helper.service';
import { ViewManagerService } from './providers/view-manager.service';
import { FuiCommonStrings } from '../../utils/i18n/common-strings.service';
import { DateNavigationService } from '../date/providers/date-navigation.service';

@Component({
  selector: 'fui-daypicker',
  templateUrl: './daypicker.html',
  host: { '[class.daypicker]': 'true' },
})
export class FuiDaypicker {
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
    private dateNavigationService: DateNavigationService,
    private localeHelperService: LocaleHelperService,
    public commonStrings: FuiCommonStrings
  ) {}

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
   * Calls the DateNavigationService to move to the next month.
   */
  nextMonth(): void {
    this.dateNavigationService.moveToNextMonth();
  }

  /**
   * Calls the DateNavigationService to move to the previous month.
   */
  previousMonth(): void {
    this.dateNavigationService.moveToPreviousMonth();
  }

  /**
   * Calls the DateNavigationService to move to the current month.
   */
  currentMonth(): void {
    this.dateNavigationService.moveToCurrentMonth();
  }
}
