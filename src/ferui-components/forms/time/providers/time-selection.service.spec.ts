import { TimeSelectionService } from './time-selection.service';
import { TimeModel } from '../models/time.model';

export default function(): void {
  describe('TimeSelectionService', function() {
    let service: TimeSelectionService, testModel: TimeModel;

    beforeEach(() => {
      testModel = new TimeModel(10, 20, 30);
      service = new TimeSelectionService();
    });

    it('provides observable for control changes, passing the control', () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.selectedTimeChange.subscribe(control => cb(control));
      expect(cb).not.toHaveBeenCalled();
      service.notifySelectedTime(testModel);
      expect(cb).toHaveBeenCalledWith(testModel);
      sub.unsubscribe();
    });
  });
}
