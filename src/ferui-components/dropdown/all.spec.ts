import DropdownMenuSpecs from './dropdown-menu.spec';
import DropdownSpecs from './dropdown.spec';
import { addHelpers } from '../forms/tests/helpers.spec';

describe('Dropdown', function() {
  addHelpers();

  describe('Components', function() {
    DropdownSpecs();
    DropdownMenuSpecs();
  });
});
