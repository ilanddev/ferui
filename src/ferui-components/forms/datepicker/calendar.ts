import { Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '../../utils/key-codes/key-codes';

import { CalendarViewModel } from './model/calendar-view.model';
import { CalendarModel } from './model/calendar.model';
import { DayModel } from './model/day.model';
import { DatepickerFocusService } from './providers/datepicker-focus.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { NO_OF_DAYS_IN_A_WEEK } from './utils/constants';
import { AfterViewInit } from '@angular/core';
import { DateNavigationService } from '../date/providers/date-navigation.service';

@Component({ selector: 'fui-calendar', templateUrl: './calendar.html' })
export class FuiCalendar implements OnDestroy, AfterViewInit {
  /**
   * Calendar View Model to generate the Calendar.
   */
  calendarViewModel: CalendarViewModel;

  private subscriptions: Subscription[] = [];

  /**
   * Gets the locale days according to the TranslationWidth.Narrow format.
   */
  get localeDaysNarrow(): ReadonlyArray<string> {
    return this.localeHelperService.localeDaysNarrow;
  }

  get calendar(): CalendarModel {
    return this.dateNavigationService.displayedCalendar;
  }

  get selectedDay(): DayModel {
    return this.dateNavigationService.selectedDay;
  }

  get focusedDay(): DayModel {
    return this.dateNavigationService.focusedDay;
  }

  get today(): DayModel {
    return this.dateNavigationService.today;
  }

  constructor(
    private localeHelperService: LocaleHelperService,
    private dateNavigationService: DateNavigationService,
    private datepickerFocusService: DatepickerFocusService,
    private elRef: ElementRef
  ) {
    this.generateCalendarView();
    this.initializeSubscriptions();
  }

  /**
   * Delegates Keyboard arrow navigation to the DateNavigationService.
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event && this.focusedDay) {
      switch (event.keyCode) {
        case UP_ARROW:
          event.preventDefault();
          this.dateNavigationService.incrementFocusDay(-1 * NO_OF_DAYS_IN_A_WEEK);
          break;
        case DOWN_ARROW:
          event.preventDefault();
          this.dateNavigationService.incrementFocusDay(NO_OF_DAYS_IN_A_WEEK);
          break;
        case LEFT_ARROW:
          event.preventDefault();
          this.dateNavigationService.incrementFocusDay(-1);
          break;
        case RIGHT_ARROW:
          event.preventDefault();
          this.dateNavigationService.incrementFocusDay(1);
          break;
        default:
          break; // No default case. TSLint x-(
      }
    }
  }

  /**
   * Focuses on the focusable day when the Calendar View is initialized.
   */
  ngAfterViewInit() {
    this.datepickerFocusService.focusCell(this.elRef);
  }

  /**
   * Unsubscribe from subscriptions.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  /**
   * Initialize subscriptions to:
   * 1. update the calendar view model.
   * 2. update the focusable day in the calendar view model.
   * 3. focus on the focusable day in the calendar.
   */
  private initializeSubscriptions(): void {
    this.subscriptions.push(
      this.dateNavigationService.displayedCalendarChange.subscribe(() => {
        this.generateCalendarView();
      })
    );

    this.subscriptions.push(
      this.dateNavigationService.focusedDayChange.subscribe((focusedDay: DayModel) => {
        this.calendarViewModel.updateFocusableDay(focusedDay);
      })
    );

    this.subscriptions.push(
      this.dateNavigationService.focusOnCalendarChange.subscribe(() => {
        this.datepickerFocusService.focusCell(this.elRef);
      })
    );
  }

  /**
   * Generates the Calendar View based on the calendar retrieved from the DateNavigationService.
   */
  private generateCalendarView(): void {
    this.calendarViewModel = new CalendarViewModel(
      this.calendar,
      this.selectedDay,
      this.focusedDay,
      this.today,
      this.localeHelperService.firstDayOfWeek
    );
  }
}
