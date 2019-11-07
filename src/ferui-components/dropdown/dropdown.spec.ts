import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FuiDropdownModule } from './dropdown.module';
import { FuiDropdown } from './dropdown';
import { IfOpenService } from '../utils/conditional/if-open.service';

export default function(): void {
  describe('Dropdown', () => {
    let fixture: ComponentFixture<any>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [FuiDropdownModule], declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      compiled = fixture.nativeElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('projects content', () => {
      expect(compiled.textContent).toMatch(/Dropdown/);
    });

    it('adds the .fui-dropdown class on fui-dropdown', () => {
      expect(compiled.querySelector('.fui-dropdown')).not.toBeNull();
    });

    it('adds the .fui-dropdown-trigger class on fuiDropdownTrigger', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('[fuiDropdownTrigger]');
      expect(dropdownToggle.classList.contains('.fui-dropdown-trigger'));
    });

    it('adds the .fui-dropdown-item class on fuiDropdownItem', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();

      const dropdownItem: HTMLElement = compiled.querySelector('[fuiDropdownItem]');
      expect(dropdownItem.classList.contains('.fui-dropdown-item'));
    });

    it('toggles the menu when clicked on the host', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');

      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).not.toBeNull();

      // click the dropdown toggle again to close the menu
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();
    });

    it('toggles the nested menu when clicked on the toggle', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      dropdownToggle.click();
      // detect the click
      fixture.detectChanges();

      const nestedToggle: HTMLElement = compiled.querySelector('.nested');
      expect(compiled.textContent.trim()).not.toMatch('Foo');
      nestedToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.textContent.trim()).toMatch('Foo');

      // click the nested toggle again to close the menu
      nestedToggle.click();
      // detect the click
      fixture.detectChanges();
      expect(compiled.textContent.trim()).not.toMatch('Foo');
    });

    it('closes the menu when clicked outside of the host', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      const outsideButton: HTMLElement = compiled.querySelector('.outside-click-test');

      // check if the dropdown is closed
      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();

      // click outside the dropdown
      outsideButton.click();
      fixture.detectChanges();

      // check if the click handler is triggered
      expect(fixture.componentInstance.testCnt).toEqual(1);
      // check if the open class is added
      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();

      // click on the dropdown
      dropdownToggle.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).not.toBeNull();

      // click outside the dropdown
      outsideButton.click();
      fixture.detectChanges();

      // check if the click handler is triggered
      expect(fixture.componentInstance.testCnt).toEqual(2);
      // check if the open class is added
      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();
    });

    it('supports fuiMenuClosable option. Closes the dropdown menu when fuiMenuClosable is set to true', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      dropdownToggle.click();
      fixture.detectChanges();

      const dropdownItem: HTMLElement = compiled.querySelector('.fui-dropdown-item');

      dropdownItem.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();

      fixture.componentInstance.menuClosable = false;
      dropdownToggle.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).not.toBeNull();

      dropdownItem.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).not.toBeNull();
    });

    it('closes all dropdown menus when fuiMenuClosable is true', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      dropdownToggle.click();
      fixture.detectChanges();

      const nestedToggle: HTMLElement = compiled.querySelector('.nested');
      nestedToggle.click();

      fixture.detectChanges();

      const nestedItem: HTMLElement = compiled.querySelector('.nested-item');
      nestedItem.click();

      fixture.detectChanges();

      const items: HTMLElement = compiled.querySelector('.fui-dropdown-item');
      expect(items).toBeNull();
    });

    it('does not close the menu when a disabled item is clicked', () => {
      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      dropdownToggle.click();
      fixture.detectChanges();

      const disabledDropdownItem: HTMLElement = compiled.querySelector('.fui-dropdown-item.disabled');
      const dropdownItem: HTMLElement = compiled.querySelector('.fui-dropdown-item');

      disabledDropdownItem.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).not.toBeNull();

      dropdownItem.click();
      fixture.detectChanges();
      expect(compiled.querySelector('.fui-dropdown-item')).toBeNull();
    });

    it("doesn't close before custom click events have triggered", function() {
      const ifOpenService = fixture.debugElement.query(By.directive(FuiDropdown)).injector.get(IfOpenService);

      const dropdownToggle: HTMLElement = compiled.querySelector('.fui-dropdown-trigger');
      dropdownToggle.click();
      fixture.detectChanges();

      const nestedToggle: HTMLElement = compiled.querySelector('.nested');
      nestedToggle.click();
      fixture.detectChanges();

      ifOpenService.openChange.subscribe(() => {
        expect(fixture.componentInstance.customClickHandlerDone).toBe(true);
      });

      const nestedItem: HTMLElement = compiled.querySelector('.nested-item');
      nestedItem.click();
      fixture.detectChanges();

      // Make sure the dropdown correctly closed, otherwise our expect() in the subscription might not have run.
      expect(ifOpenService.open).toBe(false);
    });
  });
}

@Component({
  template: `
    <button class="outside-click-test" (click)="outsideButtonClickHandler()">
      Button to test clicks outside of the dropdown component
    </button>
    <fui-dropdown [fuiCloseMenuOnItemClick]="menuClosable">
      <button class="btn btn-primary" type="button" fuiDropdownTrigger>
        Dropdown
        <clr-icon shape="caret down"></clr-icon>
      </button>
      <fui-dropdown-menu *fuiIfOpen>
        <label class="dropdown-header">Header</label>
        <a href="javascript://" fuiDropdownItem>Item</a>
        <a href="javascript://" class="disabled" fuiDropdownItem>Disabled Item</a>
        <fui-dropdown>
          <button fuiDropdownTrigger class="nested">Nested</button>
          <fui-dropdown-menu *fuiIfOpen>
            <a href="javascript://" fuiDropdownItem class="nested-item" (click)="customClickHandler()">Foo</a>
          </fui-dropdown-menu>
        </fui-dropdown>
      </fui-dropdown-menu>
    </fui-dropdown>
  `,
})
class TestComponent {
  @ViewChild(FuiDropdown) dropdownInstance: FuiDropdown;

  customClickHandlerDone = false;
  menuClosable: boolean = true;
  testCnt: number = 0;

  outsideButtonClickHandler(): void {
    this.testCnt++;
  }

  customClickHandler() {
    this.customClickHandlerDone = true;
  }
}
