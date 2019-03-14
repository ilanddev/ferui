import {
  FormatWidth,
  FormStyle,
  getLocaleDateFormat,
  getLocaleTimeFormat,
  getLocaleDayNames,
  getLocaleFirstDayOfWeek,
  getLocaleMonthNames,
  TranslationWidth,
} from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
@Injectable()
export class LocaleHelperService {
  get firstDayOfWeek(): number {
    return this._firstDayOfWeek;
  }

  get localeDaysNarrow(): ReadonlyArray<string> {
    return this._localeDaysNarrow;
  }

  get localeMonthsAbbreviated(): ReadonlyArray<string> {
    return this._localeMonthsAbbreviated;
  }

  get localeMonthsWide(): ReadonlyArray<string> {
    return this._localeMonthsWide;
  }

  get localeDateFormat(): string {
    return this._localeDateFormat;
  }

  get localeTimeFormat(): string {
    return this._localeTimeFormat;
  }

  get localeDatetimeFormat(): string {
    return this._localeDatetimeFormat;
  }

  private _firstDayOfWeek: number = 0;
  private _localeDaysNarrow: ReadonlyArray<string>;
  private _localeMonthsAbbreviated: ReadonlyArray<string>;
  private _localeMonthsWide: ReadonlyArray<string>;
  private _localeDateFormat: string;
  private _localeTimeFormat: string;
  private _localeDatetimeFormat: string;

  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.initializeLocaleData();
  }

  toLocaleTimeString(date: Date): string {
    if (!date) {
      return null;
    }
    return date.toLocaleTimeString(this.locale);
  }

  toLocaleDatetimeString(date: Date): string {
    if (!date) {
      return null;
    }
    return date.toLocaleString(this.locale);
  }

  /**
   * Initializes the locale data.
   */
  private initializeLocaleData(): void {
    // Order in which these functions is called is very important.
    this.initializeFirstDayOfWeek();
    this.initializeLocaleDateFormat();
    this.initializeLocaleTimeFormat();
    this.initializeLocaleDatetimeFormat();
    this.initializeLocaleMonthsAbbreviated();
    this.initializeLocaleMonthsWide();
    this.initializeLocaleDaysNarrow();
  }

  /**
   * Initialize day names in the TranslationWidth.Narrow format based on the locale.
   * eg: [S, M, T...] for en-US.
   */
  private initializeLocaleDaysNarrow(): void {
    // Get locale day names starting with Sunday
    const tempArr: string[] = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Narrow).slice();
    // Get first day of the week based on the locale
    const firstDayOfWeek: number = this.firstDayOfWeek;
    // Rearrange the tempArr to start with the first day of the week based on the locale.
    if (firstDayOfWeek > 0) {
      const prevDays: string[] = tempArr.splice(0, firstDayOfWeek);
      tempArr.push(...prevDays);
    }
    this._localeDaysNarrow = tempArr;
  }

  /**
   * Initializes the array of month names in the TranslationWidth.Abbreviated format.
   * e.g. `[Jan, Feb, ...]` for en-US
   */
  private initializeLocaleMonthsAbbreviated(): void {
    this._localeMonthsAbbreviated = getLocaleMonthNames(
      this.locale,
      FormStyle.Standalone,
      TranslationWidth.Abbreviated
    ).slice();
  }

  /**
   * Initializes the array of month names in the TranslationWidth.Wide format.
   * e.g. `[January, February, ...]` for en-US
   */
  private initializeLocaleMonthsWide(): void {
    this._localeMonthsWide = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
  }

  /**
   * Initializes the first day of the week based on the locale.
   */
  private initializeFirstDayOfWeek(): void {
    this._firstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
  }

  private initializeLocaleDateFormat(): void {
    this._localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
  }

  private initializeLocaleTimeFormat(): void {
    this._localeTimeFormat = getLocaleTimeFormat(this.locale, FormatWidth.Medium);
  }

  private initializeLocaleDatetimeFormat(): void {
    this._localeDatetimeFormat = [this._localeDateFormat, this._localeTimeFormat].join(' ');
  }
}
