import { TestBed, async } from '@angular/core/testing';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FuiCommonFormsModule } from '../common/common.module';
import { IfErrorService } from '../common/if-error/if-error.service';

import { NgControlService } from '../common/providers/ng-control.service';
import { MarkControlService } from '../common/providers/mark-control.service';
import { ClrIconModule } from '@ferui/components';

export function ContainerNoLabelSpec(testContainer, testControl, testComponent): void {
  describe('no label', () => {
    let fixture, containerDE, containerEl;
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrIconModule, FuiCommonFormsModule, FormsModule],
        declarations: [testContainer, testControl, testComponent],
        providers: [NgControl, NgControlService, IfErrorService, MarkControlService]
      });
      fixture = TestBed.createComponent(testComponent);

      containerDE = fixture.debugElement.query(By.directive(testContainer));
      containerEl = containerDE.nativeElement;
    });

    it('adds an empty label when instantiated', () => {
      fixture.detectChanges();
      const labels = containerEl.querySelectorAll('label');
      expect(Array.prototype.filter.call(labels, label => label.textContent === '').length).toBeGreaterThanOrEqual(1);
    });
  });
}

export function TemplateDrivenSpec(testContainer, testControl, testComponent, wrapperClass): void {
  fullSpec('template-driven', testContainer, testControl, testComponent, wrapperClass);
}

export function ReactiveSpec(testContainer, testControl, testComponent, wrapperClass): void {
  fullSpec('reactive', testContainer, testControl, testComponent, wrapperClass);
}

function fullSpec(description, testContainer, directives: any | any[], testComponent, wrapperClass) {
  describe(description, () => {
    let fixture, containerDE, container, containerEl, ifErrorService, markControlService;
    if (!Array.isArray(directives)) {
      directives = [directives];
    }
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrIconModule, FuiCommonFormsModule, FormsModule, ReactiveFormsModule],
        declarations: [testContainer, ...directives, testComponent],
        providers: [NgControl, NgControlService, IfErrorService, MarkControlService]
      });
      fixture = TestBed.createComponent(testComponent);

      containerDE = fixture.debugElement.query(By.directive(testContainer));
      container = containerDE.componentInstance;
      containerEl = containerDE.nativeElement;
      ifErrorService = containerDE.injector.get(IfErrorService);
      markControlService = containerDE.injector.get(MarkControlService);
      fixture.detectChanges();
    });

    it('injects the ifErrorService and subscribes', () => {
      expect(ifErrorService).toBeTruthy();
      expect(container.subscriptions[0]).toBeTruthy();
    });

    it('projects the label as first child', () => {
      const label = containerEl.querySelector('label');
      expect(label).toBeTruthy();
      expect(label.previousElementSibling).toBeFalsy();
    });

    it('projects the control inside of the wrapper', () => {
      expect(containerEl.querySelector(wrapperClass)).toBeTruthy();
    });

    it('sets error classes and displays the icon when invalid', () => {
      expect(containerEl.querySelector('.fui-control-container').classList.contains('fui-error')).toBeFalse();
      expect(containerEl.querySelector('.fui-error-icon')).toBeFalsy();
      container.invalid = true;
      fixture.detectChanges();
      expect(containerEl.querySelector('.fui-control-container').classList.contains('fui-error')).toBeTrue();
      expect(containerEl.querySelector('.fui-error-icon')).toBeTruthy();
    });

    it('projects the error helper when invalid', () => {
      expect(containerEl.querySelector('fui-control-error')).toBeFalsy();
      container.invalid = true;
      fixture.detectChanges();
      expect(containerEl.querySelector('fui-control-error')).toBeTruthy();
    });

    it('adds the .fui-form-control class to the host', () => {
      expect(containerEl.classList).toContain('fui-form-control');
    });

    it('adds the error class for the control container', () => {
      expect(container.controlClass()).not.toContain('fui-error');
      container.invalid = true;
      expect(container.controlClass()).toContain('fui-error');
    });

    it('tracks the validity of the form control', () => {
      expect(container.invalid).toBeFalse();
      markControlService.markAsDirty();
      fixture.detectChanges();
      expect(container.invalid).toBeTrue();
    });

    it('tracks the disabled state', async(() => {
      const test = fixture.debugElement.componentInstance;
      test.disabled = true;
      fixture.detectChanges();
      // Have to wait for the whole control to settle or it doesn't track
      fixture.whenStable().then(() => {
        expect(containerEl.className).not.toContain('fui-form-control-disabled');
        if (test.form) {
          // Handle setting disabled based on reactive form
          test.form.get('model').reset({ value: '', disabled: true });
        }
        fixture.detectChanges();
        expect(containerEl.className).toContain('fui-form-control-disabled');
      });
    }));

    it('implements ngOnDestroy', () => {
      expect(container.ngOnDestroy).toBeDefined();
    });
  });
}
