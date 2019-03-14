import DatetimeIOServiceSpecs from './providers/datetime-io.service.spec';
import DatetimeFormControlServiceSpecs from './providers/datetime-form-control.service.spec';
import DatetimeContainerSpecs from './datetime-container.spec';
import { addHelpers } from '../tests/helpers.spec';

describe('Datetime Input', function() {
  addHelpers();

  describe('Providers', function() {
    DatetimeIOServiceSpecs();
    DatetimeFormControlServiceSpecs();
  });

  describe('Components', function() {
    DatetimeContainerSpecs();
  });
});
