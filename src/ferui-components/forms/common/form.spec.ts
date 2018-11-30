import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FuiForm } from './form';
import { MarkControlService } from './providers/mark-control.service';

@Component({
  template: `<form fuiForm></form>`,
})
class SimpleTest {
  @ViewChild(FuiForm) form: FuiForm;
}

export default function(): void {
  describe('FuiForm', () => {
    let fixture, directive;

    beforeEach(function() {
      TestBed.configureTestingModule({ declarations: [FuiForm, SimpleTest] });
      fixture = TestBed.createComponent(SimpleTest);
      directive = fixture.debugElement.query(By.directive(FuiForm));
    });

    it('adds the .fui-form class to host', function() {
      fixture.detectChanges();
      expect(directive.nativeElement.className).toContain('fui-form');
    });

    it('adds the horizontal layout class to host', function() {
      fixture.detectChanges();
      expect(directive.nativeElement.className).toContain('fui-form-horizontal');
    });

    it('adds the vertical layout class to host', function() {
      fixture.detectChanges();
      // There is no need to put `fui-form-vertical` because its the default behavior in CSS
      expect(directive.nativeElement.className).toEqual('fui-form');
    });

    it('adds the compact layout class to host', function() {
      fixture.detectChanges();
      expect(directive.nativeElement.className).toContain('fui-form-compact');
    });

    it('provides the LayoutService', function() {
      fixture.detectChanges();
    });

    it('provides the MarkControlService', function() {
      expect(directive.injector.get(MarkControlService)).toBeTruthy();
    });

    it('calls markAsDirty', function() {
      const service = directive.injector.get(MarkControlService);
      spyOn(service, 'markAsDirty');
      directive.componentInstance.form.markAsDirty();
      expect(service.markAsDirty).toHaveBeenCalled();
    });
  });
}
