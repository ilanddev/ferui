import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async } from '@angular/core/testing';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { NgControlService } from '../common/providers/ng-control.service';

import { DateFormControlService } from '../common/providers/date-form-control.service';
import { TimeIOService } from './providers/time-io.service';
import { TimeSelectionService } from './providers/time-selection.service';
import { FuiTimeContainer } from './time-container';
import { TestContext } from '../tests/helpers.spec';
import { LocaleHelperService } from '../datepicker/providers/locale-helper.service';
import { PlaceholderService } from '../common/providers/placeholder.service';
import { RequiredControlService } from '../common/providers/required-control.service';
import { FuiFormLayoutService } from '../common/providers/form-layout.service';

export default function() {
  describe('Time Container Component', () => {
    let context: TestContext<FuiTimeContainer, TestComponent>;
    let dateFormControlService: DateFormControlService;

    beforeEach(function() {
      TestBed.configureTestingModule({
        imports: [FormsModule],
      });
      TestBed.overrideComponent(FuiTimeContainer, {
        set: {
          providers: [
            PlaceholderService,
            RequiredControlService,
            TimeSelectionService,
            LocaleHelperService,
            ControlClassService,
            IfErrorService,
            FocusService,
            NgControlService,
            TimeIOService,
            ControlIdService,
            DateFormControlService,
            FuiFormLayoutService,
          ],
        },
      });

      context = this.create(FuiTimeContainer, TestComponent, []);
      dateFormControlService = context.getFeruiProvider(DateFormControlService);
    });

    describe('View Basics', () => {
      beforeEach(() => {
        context.detectChanges();
      });

      it('applies the fui-form-control class', () => {
        expect(context.feruiElement.className).toContain('fui-form-control');
      });

      it('projects the time input', () => {
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
    <fui-time-container>
      <input type="time" fuiTime [(ngModel)]="model" [disabled]="disabled" />
    </fui-time-container>
  `,
})
class TestComponent {
  model = '';
  disabled = false;
}
