import { Injectable } from '@angular/core';
import { DatetimeIoInterface } from '../../common/datetime-io-interface';
import { DEFAULT_LOCALE_DATETIME_FORMAT, USER_INPUT_DATETIME_REGEX } from '../../datepicker/utils/constants';
import { LocaleHelperService } from '../../datepicker/providers/locale-helper.service';
import { TimeIOService } from '../../time/providers/time-io.service';
import { DateIOService } from '../../date/providers/date-io.service';

@Injectable()
export class DatetimeIOService implements DatetimeIoInterface {
  cldrLocaleDatetimeFormat: string = DEFAULT_LOCALE_DATETIME_FORMAT;

  private timeIOService: TimeIOService;
  private dateIOService: DateIOService;

  constructor(private localeHelperService: LocaleHelperService) {
    this.cldrLocaleDatetimeFormat = this.localeHelperService.localeDatetimeFormat;
    this.timeIOService = new TimeIOService(localeHelperService);
    this.dateIOService = new DateIOService(localeHelperService);
  }

  toLocaleDisplayFormatString(date: Date): string {
    if (date && !isNaN(date.getTime())) {
      return this.localeHelperService.toLocaleDatetimeString(date);
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

    const dateParts: string[] = date.split(USER_INPUT_DATETIME_REGEX);
    let datetimeFirstPart: Date = null;
    let dateTimeSecondPart: Date = null;

    if (!dateParts || dateParts.length < 2 || dateParts.length > 4) {
      return null;
    } else if (dateParts.length === 4) {
      const [_, dateS, timeS] = dateParts;
      datetimeFirstPart = this.dateIOService.getDateValueFromDateOrString(dateS);
      dateTimeSecondPart = this.timeIOService.getDateValueFromDateOrString(timeS);
    }
    if (datetimeFirstPart instanceof Date && dateTimeSecondPart instanceof Date) {
      datetimeFirstPart.setHours(dateTimeSecondPart.getHours());
      datetimeFirstPart.setMinutes(dateTimeSecondPart.getMinutes());
      datetimeFirstPart.setSeconds(dateTimeSecondPart.getSeconds());
      return datetimeFirstPart;
    }
    return null;
  }
}
