import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async } from '@angular/core/testing';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';

import { DateFormControlService } from '../common/providers/date-form-control.service';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { MockDatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service.mock';
import { FuiDateContainer } from './date-container';
import { TestContext } from '../tests/helpers.spec';
import { DatepickerEnabledService } from '../datepicker/providers/datepicker-enabled.service';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

export default function() {
  describe('Date Container Component', () => {
    let context: TestContext<FuiDateContainer, TestComponent>;
    let enabledService: MockDatepickerEnabledService;
    let dateFormControlService: DateFormControlService;
    let ifOpenService: IfOpenService;

    beforeEach(function() {
      TestBed.configureTestingModule({
        imports: [FormsModule]
      });
      TestBed.overrideComponent(FuiDateContainer, {
        set: {
          providers: [
            { provide: DatepickerEnabledService, useClass: MockDatepickerEnabledService },
            IfOpenService,
            DateNavigationService,
            LocaleHelperService,
            ControlClassService,
            IfErrorService,
            FocusService,
            NgControlService,
            DateIOService,
            ControlIdService,
            DateFormControlService,
            PlaceholderService,
            RequiredControlService,
            FuiFormLayoutService
          ]
        }
      });

      context = this.create(FuiDateContainer, TestComponent, []);

      enabledService = <MockDatepickerEnabledService>context.getFeruiProvider(DatepickerEnabledService);
      dateFormControlService = context.getFeruiProvider(DateFormControlService);
      ifOpenService = context.getFeruiProvider(IfOpenService);
    });

    describe('View Basics', () => {
      beforeEach(() => {
        context.detectChanges();
      });

      it('applies the fui-form-control class', () => {
        expect(context.feruiElement.className).toContain('fui-form-control');
      });

      it('projects the date input', () => {
        context.detectChanges();
        expect(context.feruiElement.querySelector('input')).not.toBeNull();
      });

      it('tracks the disabled state', async(() => {
        expect(context.feruiElement.className).not.toContain('fui-form-control-disabled');
        context.testComponent.disabled = true;
        context.detectChanges();
        // Have to wait for the whole control to settle or it doesn't track
        context.fixture.whenStable().then(() => {
          context.detectChanges();
          expect(context.feruiElement.className).toContain('fui-form-control-disabled');
        });
      }));
    });

    describe('Typescript API', () => {
      it('returns the classes to apply to the control', () => {
        expect(context.feruiDirective.controlClass()).not.toContain('fui-error');
        context.feruiDirective.invalid = true;
        expect(context.feruiDirective.controlClass()).toContain('fui-error');
        context.feruiDirective.invalid = false;
        expect(context.feruiDirective.controlClass()).not.toContain('fui-error');
      });
    });
  });
}

@Component({
  template: `
    <fui-date-container>
      <input type="date" fuiDate [(ngModel)]="model" [disabled]="disabled" />
    </fui-date-container>
  `
})
class TestComponent {
  model = '';
  disabled = false;
}
