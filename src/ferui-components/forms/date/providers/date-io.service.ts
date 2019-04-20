import { Injectable } from '@angular/core';

import {
  BIG_ENDIAN,
  DEFAULT_LOCALE_FORMAT,
  DELIMITER_REGEX,
  InputDateDisplayFormat,
  LITTLE_ENDIAN,
  LITTLE_ENDIAN_REGEX,
  MIDDLE_ENDIAN,
  MIDDLE_ENDIAN_REGEX,
  RTL_REGEX,
  USER_INPUT_REGEX,
} from '../../datepicker/utils/constants';
import { getNumberOfDaysInTheMonth, parseToFourDigitYear } from '../../datepicker/utils/date-utils';

import { LocaleHelperService } from '../../datepicker/providers/locale-helper.service';
import { DatetimeIoInterface } from '../../common/datetime-io-interface';

@Injectable()
export class DateIOService implements DatetimeIoInterface {
  public cldrLocaleDateFormat: string = DEFAULT_LOCALE_FORMAT;
  public delimiters: [string, string] = ['/', '/'];
  private localeDisplayFormat: InputDateDisplayFormat = LITTLE_ENDIAN;

  constructor(private localeHelperService: LocaleHelperService) {
    this.cldrLocaleDateFormat = this.localeHelperService.localeDateFormat;
    this.initializeLocaleDisplayFormat();
  }

  /**
   * Checks if the input provided by the user is valid.
   */
  getDateValueFromDateOrString(date: string | Date): Date {
    if (!date) {
      return null;
    }
    // If we use a date object already, we just want to return this object.
    if (date instanceof Date) {
      return date;
    }
    const dateParts: string[] = date.match(USER_INPUT_REGEX);
    if (!dateParts || dateParts.length !== 3) {
      return null;
    }
    const [firstPart, secondPart, thirdPart] = dateParts;
    if (this.localeDisplayFormat === LITTLE_ENDIAN) {
      // secondPart is month && firstPart is date
      return this.validateAndGetDate(thirdPart, secondPart, firstPart);
    } else if (this.localeDisplayFormat === MIDDLE_ENDIAN) {
      // firstPart is month && secondPart is date
      return this.validateAndGetDate(thirdPart, firstPart, secondPart);
    } else {
      // secondPart is month && thirdPart is date
      return this.validateAndGetDate(firstPart, secondPart, thirdPart);
    }
  }

  getLocalDate(year: string, month: string, date: string) {
    const format: string = this.cldrLocaleDateFormat.toLocaleLowerCase();
    if (LITTLE_ENDIAN_REGEX.test(format)) {
      return date + this.delimiters[0] + month + this.delimiters[1] + year;
    } else if (MIDDLE_ENDIAN_REGEX.test(format)) {
      return month + this.delimiters[0] + date + this.delimiters[1] + year;
    } else {
      return year + this.delimiters[0] + month + this.delimiters[1] + date;
    }
  }

  convertDateStringToLocalString(dateString: string, dateFormat: string): string {
    const dateParts: string[] = dateString.match(USER_INPUT_REGEX);
    if (!dateParts || dateParts.length !== 3) {
      return null;
    }
    const [firstPart, secondPart, thirdPart] = dateParts;
    if (LITTLE_ENDIAN_REGEX.test(dateFormat)) {
      // dd/mm/yyyy
      return this.getLocalDate(thirdPart, secondPart, firstPart);
    } else if (MIDDLE_ENDIAN_REGEX.test(dateFormat)) {
      // mm/dd/yyyy
      return this.getLocalDate(thirdPart, firstPart, secondPart);
    } else {
      // yyyy/mm/dd
      return this.getLocalDate(firstPart, secondPart, thirdPart);
    }
  }

  toLocaleDisplayFormatString(date: Date): string {
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        return '';
      }
      const dateNo: number = date.getDate();
      const monthNo: number = date.getMonth() + 1;
      const dateStr: string = dateNo > 9 ? dateNo.toString() : '0' + dateNo;
      const monthStr: string = monthNo > 9 ? monthNo.toString() : '0' + monthNo;
      if (this.localeDisplayFormat === LITTLE_ENDIAN) {
        return dateStr + this.delimiters[0] + monthStr + this.delimiters[1] + date.getFullYear();
      } else if (this.localeDisplayFormat === MIDDLE_ENDIAN) {
        return monthStr + this.delimiters[0] + dateStr + this.delimiters[1] + date.getFullYear();
      } else {
        return date.getFullYear() + this.delimiters[0] + monthStr + this.delimiters[1] + dateStr;
      }
    }
    return '';
  }

  get placeholderText(): string {
    const format: [string, string, string] = this.localeDisplayFormat.format;
    return format[0] + this.delimiters[0] + format[1] + this.delimiters[1] + format[2];
  }

  private initializeLocaleDisplayFormat(): void {
    const format: string = this.cldrLocaleDateFormat.toLocaleLowerCase();
    if (LITTLE_ENDIAN_REGEX.test(format)) {
      this.localeDisplayFormat = LITTLE_ENDIAN;
    } else if (MIDDLE_ENDIAN_REGEX.test(format)) {
      this.localeDisplayFormat = MIDDLE_ENDIAN;
    } else {
      // everything else is set to BIG-ENDIAN FORMAT
      this.localeDisplayFormat = BIG_ENDIAN;
    }
    this.extractDelimiters();
  }

  private extractDelimiters(): void {
    if (this.cldrLocaleDateFormat) {
      // Sanitize Date Format. Remove RTL characters.
      // FIXME: When we support RTL, remove this and handle it correctly.
      const localeFormat: string = this.cldrLocaleDateFormat.replace(RTL_REGEX, '');
      const delimiters: string[] = localeFormat.split(DELIMITER_REGEX);

      // NOTE: The split from the CLDR date format should always result
      // in an array with 4 elements. The 1st and the 2nd values are the delimiters
      // we will use in order.
      // Eg: "dd/MM/y".split(/d+|m+|y+/i) results in ["", "/", "/", ""]
      if (delimiters && delimiters.length === 4) {
        this.delimiters = [delimiters[1], delimiters[2]];
      } else {
        console.error('Unexpected date format received. Delimiters extracted: ', delimiters);
      }
    }
  }

  /**
   * Checks if the month entered by the user is valid or not.
   * Note: Month is 0 based.
   */
  private isValidMonth(month: number): boolean {
    return month > -1 && month < 12;
  }

  /**
   * Checks if the date is valid depending on the year and month provided.
   */
  private isValidDate(year: number, month: number, date: number): boolean {
    return date > 0 && date <= getNumberOfDaysInTheMonth(year, month);
  }

  /**
   * Validates the parameters provided and returns the date.
   * If the parameters are not
   * valid then return null.
   * NOTE: (Month here is 1 based since the user has provided that as an input)
   */
  private validateAndGetDate(year: string, month: string, date: string): Date {
    const y: number = +year;
    const m: number = +month - 1; // month is 0 based
    const d: number = +date;
    if (!this.isValidMonth(m) || !this.isValidDate(y, m, d)) {
      return null;
    }
    const result: number = parseToFourDigitYear(y);
    return result !== -1 ? new Date(result, m, d) : null;
  }
}
