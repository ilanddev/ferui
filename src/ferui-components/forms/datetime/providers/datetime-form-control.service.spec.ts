import { DatetimeFormControlService } from './datetime-form-control.service';
import { FuiDatetimeModelTypes } from '../../common/datetime-model-types.enum';

export default function(): void {
  describe('DatetimeFormControlService', function() {
    let service: DatetimeFormControlService;

    beforeEach(() => {
      service = new DatetimeFormControlService();
    });

    it('provides observable for model type changes', () => {
      const cb = jasmine.createSpy('cb');
      const sub = service.modelTypeChange.subscribe(modelType => cb(modelType));
      expect(cb).not.toHaveBeenCalled();
      service.setModelType(FuiDatetimeModelTypes.DATE);
      expect(cb).toHaveBeenCalledWith(FuiDatetimeModelTypes.DATE);
      service.setModelType(FuiDatetimeModelTypes.STRING);
      expect(cb).toHaveBeenCalledWith(FuiDatetimeModelTypes.STRING);
      sub.unsubscribe();
    });
  });
}
