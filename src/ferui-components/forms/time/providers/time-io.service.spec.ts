import { registerLocaleData } from '@angular/common';
import localeAk from '@angular/common/locales/ak';
import localeHr from '@angular/common/locales/hr';
import localeKkj from '@angular/common/locales/kkj';

import { TimeIOService } from './time-io.service';
import { LocaleHelperService } from '../../datepicker/providers/locale-helper.service';
import { assertEqualTimes } from '../../datepicker/utils/test-utils';

registerLocaleData(localeAk);
registerLocaleData(localeHr);
registerLocaleData(localeKkj);

export default function() {
  describe('Time IO Service', () => {
    let timeIOService: TimeIOService;
    let localeHelperService: LocaleHelperService;

    describe('Locale Formatting', function() {
      it('updates the cldrLocaleTimeFormat based on the locale helper service', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const timeIOServ: TimeIOService = new TimeIOService(localeHelperServ);
        expect(timeIOServ.cldrLocaleTimeFormat).toBe('h:mm:ss a');

        const localeHelperServ1: LocaleHelperService = new LocaleHelperService('fr-FR');
        const timeIOServ1: TimeIOService = new TimeIOService(localeHelperServ1);

        expect(timeIOServ1.cldrLocaleTimeFormat).toBe('HH:mm:ss');
      });

      it('supports a method to convert a Date object to time string based on the locale', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const timeIOServ: TimeIOService = new TimeIOService(localeHelperServ);

        expect(timeIOServ.toLocaleDisplayFormatString(new Date(2015, 1, 1, 16, 20, 30))).toBe('4:20:30 PM');

        const localeHelperServAK: LocaleHelperService = new LocaleHelperService('ak');
        const timeIOServAK: TimeIOService = new TimeIOService(localeHelperServAK);

        expect(timeIOServAK.toLocaleDisplayFormatString(new Date(2015, 1, 1, 16, 20, 30))).toBe('16:20:30');

        const localeHelperServHR: LocaleHelperService = new LocaleHelperService('hr');
        const timeIOServHR: TimeIOService = new TimeIOService(localeHelperServHR);

        expect(timeIOServHR.toLocaleDisplayFormatString(new Date(2015, 1, 1, 16, 20, 30))).toBe('16:20:30');

        const localeHelperServKKJ: LocaleHelperService = new LocaleHelperService('kkj');
        const timeIOServKKJ: TimeIOService = new TimeIOService(localeHelperServKKJ);

        expect(timeIOServKKJ.toLocaleDisplayFormatString(new Date(2016, 1, 15, 16, 20, 30))).toBe('4:20:30 PM');
      });

      it('processes an invalid date object as an empty string', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const timeIOServ: TimeIOService = new TimeIOService(localeHelperServ);

        expect(timeIOServ.toLocaleDisplayFormatString(new Date('Test'))).toBe('');
      });

      it('processes a null object as an empty string', () => {
        const localeHelperServ: LocaleHelperService = new LocaleHelperService('en-US');
        const timeIOServ: TimeIOService = new TimeIOService(localeHelperServ);

        expect(timeIOServ.toLocaleDisplayFormatString(null)).toBe('');
      });
    });

    describe('Date object Processing', () => {
      beforeEach(() => {
        localeHelperService = new LocaleHelperService('en-US');
        timeIOService = new TimeIOService(localeHelperService);
      });

      it('ignores just text', () => {
        const inputDate: string = 'abc';
        const date: Date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(date).toBeNull();
      });

      it('ignores invalid times', () => {
        let inputDate: string = '90:10:60';
        const date1: Date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(date1).toBeNull();

        inputDate = '10:00:00 pam';
        const date2: Date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(date2).toBeNull();

        inputDate = '10:40 pmtest';
        const date3: Date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(date3).toBeNull();
      });

      it('ignores empty strings', () => {
        const inputDate: string = '';
        const date: Date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(date).toBeNull();
      });

      it('processes times with different delimiters', () => {
        let inputDate: string = '4/ 20/50 PM';
        let date: Date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(assertEqualTimes(date, new Date(null, null, null, 16, 20, 50)));

        inputDate = '10.10 .0';
        date = timeIOService.getDateValueFromDateOrString(inputDate);
        expect(assertEqualTimes(date, new Date(null, null, null, 10, 10, 0)));
      });
    });
  });
}
