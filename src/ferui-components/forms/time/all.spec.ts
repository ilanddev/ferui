import TimeIOServiceSpecs from '../time/providers/time-io.service.spec';
import TimeModelSpecs from '../time/models/time.model.spec';
import TimeSelectionSpecs from '../time/providers/time-selection.service.spec';
import TimeContainerSpecs from '../time/time-container.spec';
import TimeInputSpecs from '../time/time.spec';

import { addHelpers } from '../tests/helpers.spec';

describe('Time Input', function() {
  addHelpers();

  describe('Model', function() {
    TimeModelSpecs();
  });

  describe('Providers', function() {
    TimeIOServiceSpecs();
    TimeSelectionSpecs();
  });

  describe('Components', function() {
    TimeContainerSpecs();
    TimeInputSpecs();
  });
});
