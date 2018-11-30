import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { FuiInputContainer } from '../input/input-container';

import { FuiLabel } from './label';
import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';

@Component({ template: `<label></label>` })
class NoForTest {}

@Component({ template: `<label for="hello"></label>` })
class ExplicitForTest {}

@Component({
  template: `<div><label for="hello"></label></div>`,
  providers: [ControlIdService],
})
class ContainerizedTest {}

@Component({
  template: `<div><label for="hello"></label></div>`,
  providers: [NgControlService],
})
class WrapperTest {}

@Component({
  template: `<label for="hello" class="clr-col-xs-12 clr-col-md-3"></label>`,
})
class ExistingGridTest {}

export default function(): void {
  describe('FuiLabel', () => {
    it("doesn't crash if it is not used in an Angular form", function() {
      TestBed.configureTestingModule({ declarations: [FuiLabel, NoForTest] });
      expect(() => {
        const fixture = TestBed.createComponent(NoForTest);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("doesn't set the the class unless its inside of a container", function() {
      TestBed.configureTestingModule({ declarations: [FuiLabel, NoForTest] });
      const fixture = TestBed.createComponent(NoForTest);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')
      ).toBeFalse();
    });

    it('does set the the class when its inside of a container', function() {
      TestBed.configureTestingModule({
        declarations: [FuiLabel, ContainerizedTest],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')
      ).toBeTrue();
    });

    it('does set the class when its inside of a wrapper', function() {
      TestBed.configureTestingModule({
        declarations: [FuiLabel, WrapperTest],
      });
      const fixture = TestBed.createComponent(WrapperTest);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')
      ).toBeTrue();
    });

    it('sets the for attribute to the id given by the service', function() {
      TestBed.configureTestingModule({ declarations: [FuiLabel, NoForTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(NoForTest);
      fixture.detectChanges();
      const controlIdService = fixture.debugElement.injector.get(ControlIdService);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe(controlIdService.id);
      controlIdService.id = 'test';
      fixture.detectChanges();
      expect(label.getAttribute('for')).toBe('test');
    });

    it('adds the grid classes for non-vertical layouts', function() {
      TestBed.configureTestingModule({
        declarations: [FuiLabel, FuiInputContainer, ContainerizedTest]
      });
      const fixture = TestBed.createComponent(ContainerizedTest);

      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-2')).toBeTrue();
      expect(label.classList.contains('clr-col-xs-12')).toBeTrue();
    });

    it('leaves the grid classes untouched if they exist', function() {
      TestBed.configureTestingModule({ declarations: [FuiLabel, ExistingGridTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(ExistingGridTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.className).not.toContain('clr-col-md-2');
      expect(label.className).toContain('clr-col-md-3');
    });

    it('leaves the for attribute untouched if it exists', function() {
      TestBed.configureTestingModule({ declarations: [FuiLabel, ExplicitForTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(ExplicitForTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe('hello');
    });
  });
}
