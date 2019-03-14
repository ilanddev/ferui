import { assertEqualDates, assertEqualTimes } from '../../datepicker/utils/test-utils';

import { TimeModel } from './time.model';

export default function(): void {
  describe('TimeModel', function() {
    const timeModel1: TimeModel = new TimeModel(10, 0, 0);
    const timeModel2: TimeModel = new TimeModel(20, 10, 0);
    const timeModel3: TimeModel = new TimeModel(5, 30, 20);
    const timeModel4: TimeModel = new TimeModel(5, 30, 20, new Date(2019, 10, 1));

    it('2 TimeModels are equal when the hours, minutes and seconds matches', () => {
      expect(timeModel4.isEqual(timeModel3)).toBe(true);
      expect(timeModel3.isEqual(timeModel4)).toBe(true);

      expect(timeModel1.isEqual(timeModel2)).toBe(false);
      expect(timeModel2.isEqual(timeModel1)).toBe(false);

      expect(timeModel3.isEqual(timeModel2)).toBe(false);
      expect(timeModel2.isEqual(timeModel3)).toBe(false);

      expect(timeModel1.isEqual(null)).toBe(false);
    });

    it('converts a TimeModel into the javascript date object', () => {
      const date1: Date = timeModel1.toDate();
      const date2: Date = timeModel2.toDate();
      const date3: Date = timeModel3.toDate();
      const date4: Date = timeModel4.toDate();

      expect(date1).not.toBeNull();
      expect(date2).not.toBeNull();
      expect(date3).not.toBeNull();
      expect(date4).not.toBeNull();

      expect(assertEqualTimes(date1, new Date(null, null, null, 10, 0, 0))).toBe(true);
      expect(assertEqualTimes(date2, new Date(null, null, null, 20, 10, 0))).toBe(true);
      expect(assertEqualTimes(date3, new Date(null, null, null, 5, 30, 20))).toBe(true);
      expect(assertEqualTimes(date4, new Date(null, null, null, 5, 30, 20))).toBe(true);
      expect(assertEqualDates(date4, new Date(2019, 10, 1, 5, 30, 20))).toBe(true);
    });
  });
}
