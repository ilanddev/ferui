import { Subscription } from 'rxjs';

import { DateFormControlService } from './date-form-control.service';

export default function() {
  describe('Date Form Control Service', () => {
    let dateFormControlService: DateFormControlService;

    beforeEach(() => {
      dateFormControlService = new DateFormControlService();
    });

    it('provides a way to listen to form state change to touched', () => {
      expect(dateFormControlService.touchedChange).toBeDefined();
    });

    it('provides a way to listen to form state change to dirty', () => {
      expect(dateFormControlService.dirtyChange).toBeDefined();
    });

    it('provides a method to notify that the form state should be changed to touched', () => {
      let touchedStatus: boolean = false;

      const sub: Subscription = dateFormControlService.touchedChange.subscribe(() => {
        touchedStatus = true;
      });

      dateFormControlService.markAsTouched();

      expect(touchedStatus).toBe(true);

      sub.unsubscribe();
    });

    it('provides a method to notify that the form state should be changed to dirty', () => {
      let dirtyStatus: boolean = false;

      const sub: Subscription = dateFormControlService.dirtyChange.subscribe(() => {
        dirtyStatus = true;
      });

      dateFormControlService.markAsDirty();

      expect(dirtyStatus).toBe(true);

      sub.unsubscribe();
    });
  });
}
