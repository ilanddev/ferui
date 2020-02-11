import { NumberIoService } from './number-io.service';

export default function() {
  describe('Number IO Service', () => {
    let numberIOService: NumberIoService;

    beforeEach(() => {
      numberIOService = new NumberIoService();
      numberIOService.min = 0;
      numberIOService.max = 10;
      numberIOService.step = 5;
    });

    it('can increment and decrement', () => {
      expect(numberIOService.currentValue).toEqual(0);
      expect(numberIOService.increment()).toEqual(numberIOService.step);
      expect(numberIOService.decrement()).toEqual(0);
    });

    it("shouldn't be lesser or higher than min and max", () => {
      expect(numberIOService.currentValue).toEqual(0);

      expect(numberIOService.increment()).toEqual(numberIOService.step);
      expect(numberIOService.increment()).toEqual(numberIOService.step * 2);
      // Can't go above the max value
      expect(numberIOService.increment()).toEqual(numberIOService.step * 2);

      expect(numberIOService.decrement()).toEqual(numberIOService.step);
      expect(numberIOService.decrement()).toEqual(0);
      // Can't go under the min value
      expect(numberIOService.decrement()).toEqual(0);
    });
  });
}
