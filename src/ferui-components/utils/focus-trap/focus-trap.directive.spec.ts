import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { itIgnore } from '../../../../tests/tests.helpers';

import { FocusTrapDirective } from './focus-trap.directive';
import { FuiFocusTrapModule } from './focus-trap.module';

describe('FocusTrap', () => {
  let fixture: ComponentFixture<any>;
  let compiled: any;
  let component: TestComponent;

  let lastInput: HTMLElement;

  let directiveDebugElement: DebugElement;
  let directiveInstance: FocusTrapDirective;
  let directiveElement: HTMLElement;

  describe('default behavior', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [FuiFocusTrapModule], declarations: [TestComponent] });
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      component = fixture.componentInstance;
      compiled = fixture.nativeElement;
      lastInput = compiled.querySelector('#last');

      directiveDebugElement = fixture.debugElement.query(By.directive(FocusTrapDirective));
      directiveElement = directiveDebugElement.nativeElement;
      directiveInstance = directiveDebugElement.injector.get(FocusTrapDirective);
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should create directive', () => {
      expect(directiveInstance).toBeTruthy();
    });

    it('should add tabindex attribute with value zero', () => {
      expect(directiveElement.getAttribute('tabindex')).toEqual('0');
    });

    it('should add its off-screen focus rebounder elements to document body on instantiation', () => {
      const offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(offScreenEls.length).toBe(2);
    });

    it('should add its off-screen focus elements as first an last elements in document body', () => {
      const offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(document.body.firstChild).toBe(offScreenEls[0]);
      expect(document.body.lastChild).toBe(offScreenEls[1]);
    });

    it('should rebound focus back to the directive if one of rebounding elements gets focused', () => {
      const offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');

      const beforeRebound = offScreenEls[0] as HTMLElement;
      const afterRebound = offScreenEls[1] as HTMLElement;

      beforeRebound.focus();
      expect(document.activeElement).toBe(directiveElement);
      afterRebound.focus();
      expect(document.activeElement).toBe(directiveElement);
    });

    it('should remove its off-screen focus rebounder elements from parent element on removal', () => {
      expect(document.body.querySelectorAll('span.offscreen-focus-rebounder').length).toBe(2);
      component.mainFocusTrap = false;
      fixture.detectChanges();
      expect(document.body.querySelectorAll('span.offscreen-focus-rebounder').length).toBe(0);
    });

    it(`should add off-screen rebounder elements only once`, () => {
      component.level1 = true;
      fixture.detectChanges();
      let offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(offScreenEls.length).toBe(2);
      component.level2 = true;
      fixture.detectChanges();
      offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(offScreenEls.length).toBe(2);
    });

    it(`should remove off-screen rebounder elements only once`, () => {
      component.level1 = true;
      component.level2 = true;
      fixture.detectChanges();
      let offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(offScreenEls.length).toBe(2);
      component.level2 = false;
      component.level1 = false;
      fixture.detectChanges();
      offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(offScreenEls.length).toBe(2);
      component.mainFocusTrap = false;
      fixture.detectChanges();
      offScreenEls = document.body.querySelectorAll('span.offscreen-focus-rebounder');
      expect(offScreenEls.length).toBe(0);
    });

    itIgnore(['firefox'], `should keep focus within nested element with focus trap directive`, () => {
      component.level1 = true;
      fixture.detectChanges();
      const levelOneFocusTrap = compiled.querySelector('#levelOneFocusTrap');
      lastInput.focus();
      expect(document.activeElement).toEqual(levelOneFocusTrap);
    });

    itIgnore(['firefox'], `should keep focus within last focus trap directive element`, () => {
      component.level1 = true;
      component.level2 = true;
      fixture.detectChanges();
      const levelTwoFocusTrap = compiled.querySelector('#levelTwoFocusTrap');
      const levelTwoButton = compiled.querySelector('#levelTwoButton');
      lastInput.focus();
      expect(document.activeElement).toEqual(levelTwoFocusTrap);
      levelTwoButton.focus();
      expect(document.activeElement).toEqual(
        levelTwoButton,
        `element inside currently active focus trap directive wasn't focused`
      );
    });

    itIgnore(['firefox'], `should keep trap focus within previous focus trap element if last one is removed`, () => {
      component.level1 = true;
      component.level2 = true;
      component.level3 = true;
      fixture.detectChanges();
      const levelThreeButton = compiled.querySelector('#levelThreeButton');
      const levelTwoButton = compiled.querySelector('#levelTwoButton');
      const levelTwoFocusTrap = compiled.querySelector('#levelTwoFocusTrap');
      levelThreeButton.focus();
      component.level3 = false;
      fixture.detectChanges();
      lastInput.focus();
      expect(document.activeElement).toEqual(levelTwoFocusTrap);
      levelTwoButton.focus();
      expect(document.activeElement).toEqual(
        levelTwoButton,
        `element inside currently active focus trap directive wasn't focused`
      );
    });
  });
});

@Component({
  template: `
    <form fuiFocusTrap *ngIf="mainFocusTrap">
      <button id="first">
        Button to test first input
      </button>
      <input type="text" />
      <select>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
      <button id="last">
        Last Input
      </button>

      <div id="levelOneFocusTrap" fuiFocusTrap *ngIf="level1 === true">
        <button id="levelOneButton">Level 1</button>
        <div id="levelTwoFocusTrap" fuiFocusTrap *ngIf="level2 === true">
          <button id="levelTwoButton">Level 2</button>
          <div id="levelThreeFocusTrap" fuiFocusTrap *ngIf="level3 === true">
            <button id="levelThreeButton">Level 3</button>
          </div>
        </div>
      </div>
    </form>
  `
})
class TestComponent {
  level1 = false;
  level2 = false;
  level3 = false;
  mainFocusTrap = true;
}
