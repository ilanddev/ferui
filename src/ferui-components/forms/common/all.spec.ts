import CommonSpecs from './common.spec';
import ErrorSpecs from './error.spec';
import FormSpecs from './form.spec';
import ControlStatusServiceSpecs from './if-error/if-error.service.spec';
import IfErrorSpecs from './if-error/if-error.spec';
import LabelSpecs from './label.spec';
import ControlClassServiceSpecs from './providers/control-class.service.spec';
import ControlIdServiceSpecs from './providers/control-id.service.spec';
import NgControlServiceSpecs from './providers/ng-control.service.spec';
import WrappedControlSpecs from './wrapped-control.spec';

describe('Forms common utilities', function() {
  ControlClassServiceSpecs();
  ControlIdServiceSpecs();
  ControlStatusServiceSpecs();
  NgControlServiceSpecs();
  FormSpecs();
  LabelSpecs();
  IfErrorSpecs();
  WrappedControlSpecs();
  CommonSpecs();
  ErrorSpecs();
});
