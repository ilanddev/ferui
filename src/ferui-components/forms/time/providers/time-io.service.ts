import { Injectable } from '@angular/core';
import { LocaleHelperService } from '../../datepicker/providers/locale-helper.service';
import { DEFAULT_LOCALE_TIME_FORMAT, USER_INPUT_TIME_REGEX } from '../../datepicker/utils/constants';
import { DatetimeIoInterface } from '../../common/datetime-io-interface';

@Injectable()
export class TimeIOService implements DatetimeIoInterface {
  public cldrLocaleTimeFormat: string = DEFAULT_LOCALE_TIME_FORMAT;

  constructor(private localeHelperService: LocaleHelperService) {
    this.cldrLocaleTimeFormat = this.localeHelperService.localeTimeFormat;
  }

  toLocaleDisplayFormatString(date: Date): string {
    if (date) {
      if (isNaN(date.getTime())) {
        return '';
      }
      return this.localeHelperService.toLocaleTimeString(date);
    }
    return '';
  }

  getDateValueFromDateOrString(date: string | Date): Date {
    if (!date) {
      return null;
    }
    // If we use a date object already, we just want to return this object.
    if (date instanceof Date) {
      return date;
    }

    const dateParts: string[] = date.match(USER_INPUT_TIME_REGEX);
    if (!dateParts || dateParts.length < 2 || dateParts.length > 3) {
      return null;
    } else if (dateParts.length === 3) {
      const [firstPart, secondPart, thirdPart] = dateParts;
      const meridiemSplit = thirdPart.split(/\s+/g);
      if (meridiemSplit.length === 2) {
        const [seconds, meridiem] = meridiemSplit;
        return this.validateAndGetDate(firstPart, secondPart, seconds, meridiem);
      } else {
        const [seconds] = meridiemSplit;
        return this.validateAndGetDate(firstPart, secondPart, seconds);
      }
    } else if (dateParts.length === 2) {
      const [firstPart, secondPart] = dateParts;
      const meridiemSplit = secondPart.split(/\s+/g);
      if (meridiemSplit.length === 2) {
        const [minutes, meridiem] = meridiemSplit;
        return this.validateAndGetDate(firstPart, minutes, null, meridiem);
      } else {
        const [minutes] = meridiemSplit;
        return this.validateAndGetDate(firstPart, minutes);
      }
    }
    return null;
  }

  private validateAndGetDate(hour: string, minute: string, second?: string, meridiem?: string): Date {
    let h: number = +hour;
    const m: number = +minute;
    const s: number = second ? +second : 0;
    if (h >= 24 || m >= 60 || (second && s >= 60) || (meridiem && meridiem.search(/^am|pm$/gi) === -1)) {
      return null;
    }
    const today: Date = new Date();
    if (meridiem) {
      if (h === 12) {
        if (meridiem.search(/pm/i) > -1) {
          h = 12;
        } else if (meridiem.search(/am/i) > -1) {
          h = 0;
        }
      } else {
        if (meridiem.search(/pm/i) > -1) {
          h = h + 12;
        }
      }
    }
    today.setHours(h);
    today.setMinutes(m);

    if (second) {
      today.setSeconds(s);
      return today;
    }
    return today;
  }
}
