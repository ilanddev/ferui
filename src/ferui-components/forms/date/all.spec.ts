import DateIOServiceSpecs from '../date/providers/date-io.service.spec';
import DateContainerSpecs from '../date/date-container.spec';
import DateInputSpecs from '../date/date.spec';
import DateNavigationServiceSpecs from '../date/providers/date-navigation.service.spec';
import { addHelpers } from '../tests/helpers.spec';

describe('Date Input', function() {
  addHelpers();

  describe('Providers', function() {
    DateIOServiceSpecs();
    DateNavigationServiceSpecs();
  });

  describe('Components', function() {
    DateContainerSpecs();
    DateInputSpecs();
  });
});
