import { Injectable } from '@angular/core';

const enum DatepickerViewEnum {
  MONTHVIEW = 'MONTHVIEW',
  YEARVIEW = 'YEARVIEW',
  DAYVIEW = 'DAYVIEW'
}

/**
 * This service manages which view is visible in the datepicker popover.
 */
@Injectable()
export class ViewManagerService {
  private currentView: DatepickerViewEnum = DatepickerViewEnum.DAYVIEW;

  get isDayView(): boolean {
    return this.currentView === DatepickerViewEnum.DAYVIEW;
  }

  get isYearView(): boolean {
    return this.currentView === DatepickerViewEnum.YEARVIEW;
  }

  get isMonthView(): boolean {
    return this.currentView === DatepickerViewEnum.MONTHVIEW;
  }

  changeToMonthView(): void {
    this.currentView = DatepickerViewEnum.MONTHVIEW;
  }

  changeToYearView(): void {
    this.currentView = DatepickerViewEnum.YEARVIEW;
  }

  changeToDayView(): void {
    this.currentView = DatepickerViewEnum.DAYVIEW;
  }
}
