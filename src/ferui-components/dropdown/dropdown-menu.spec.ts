import { Component } from '@angular/core';
import { TestContext } from '../forms/tests/helpers.spec';
import { IfOpenService } from '../utils/conditional/if-open.service';
import { FuiDropdownMenu } from './dropdown-menu';
import { Point } from '../popover/common/popover';

export default function(): void {
  describe('DropdownMenu component', function() {
    let context: TestContext<FuiDropdownMenu, SimpleTest>;

    beforeEach(function() {
      context = this.create(FuiDropdownMenu, SimpleTest, [IfOpenService]);
      context.getFeruiProvider(IfOpenService).open = true;
      context.detectChanges();
    });

    it('projects content', function() {
      expect(context.feruiElement.textContent.trim()).toMatch('Hello world');
    });

    it('has the correct css classes', () => {
      expect(context.testElement.querySelector('.fui-dropdown-menu')).not.toBeNull();
    });

    it('supports fuiPosition option', () => {
      // Default is bottom-left since menuPosition is set to ""
      expect((<any>context.feruiDirective).anchorPoint).toEqual(Point.BOTTOM_LEFT);
      expect((<any>context.feruiDirective).popoverPoint).toEqual(Point.LEFT_TOP);

      context.feruiDirective.position = 'bottom-right';
      context.detectChanges();
      expect((<any>context.feruiDirective).anchorPoint).toEqual(Point.BOTTOM_RIGHT);
      expect((<any>context.feruiDirective).popoverPoint).toEqual(Point.RIGHT_TOP);

      context.feruiDirective.position = 'top-right';
      context.detectChanges();
      expect((<any>context.feruiDirective).anchorPoint).toEqual(Point.TOP_RIGHT);
      expect((<any>context.feruiDirective).popoverPoint).toEqual(Point.RIGHT_BOTTOM);
    });
  });
}

@Component({
  template: `
    <fui-dropdown>
      <fui-dropdown-menu [fuiPosition]="position">
        Hello world
      </fui-dropdown-menu>
    </fui-dropdown>
  `,
})
class SimpleTest {
  position: string;
}
