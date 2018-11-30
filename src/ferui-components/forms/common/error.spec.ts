import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FuiControlError } from './error';

@Component({ template: `<clr-control-error>Test error</clr-control-error>` })
class SimpleTest {}

export default function(): void {
  describe('ClrControlError', () => {
    let fixture;

    beforeEach(function() {
      TestBed.configureTestingModule({ declarations: [FuiControlError, SimpleTest] });
      fixture = TestBed.createComponent(SimpleTest);
      fixture.detectChanges();
    });

    it('projects content', function() {
      expect(fixture.debugElement.query(By.directive(FuiControlError)).nativeElement.innerText).toContain('Test error');
    });

    it('adds the .clr-subtext class to host', function() {
      expect(
        fixture.debugElement.query(By.directive(FuiControlError)).nativeElement.classList.contains('clr-subtext')
      ).toBeTrue();
    });
  });
}
