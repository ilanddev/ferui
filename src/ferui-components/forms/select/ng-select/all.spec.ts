import NgSelectComponentSpecs from './ng-select.component.spec';
import NgSelectOptionHighlightDirectiveSpecs from './ng-option-highlight.directive.spec';
import NgSelectDropdownPanelSpecs from './ng-dropdown-panel.service.spec';
import NgSelectItemsListSpecs from './items-list.spec';

export default function(): void {
  describe('NgSelect component', function() {
    NgSelectComponentSpecs();
    NgSelectOptionHighlightDirectiveSpecs();
    NgSelectDropdownPanelSpecs();
    NgSelectItemsListSpecs();
  });
}
