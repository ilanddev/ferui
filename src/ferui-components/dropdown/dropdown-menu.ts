import { Component, ElementRef, Inject, Injector, Input, OnInit, Optional, Self, SkipSelf } from '@angular/core';
import { AbstractPopover } from '../popover/common/abstract-popover';
import { POPOVER_HOST_ANCHOR } from '../popover/common/popover-host-anchor.token';
import { Point } from '../popover/common/popover';

@Component({
  selector: 'fui-dropdown-menu',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    '[class.fui-dropdown-menu]': 'true',
    '[class.visible]': 'isOpen()',
  },
})
export class FuiDropdownMenu extends AbstractPopover implements OnInit {
  @Input() appendTo: string;

  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef,
    @Optional()
    @SkipSelf()
    nested: FuiDropdownMenu
  ) {
    if (!parentHost) {
      throw new Error('fui-dropdown-menu should only be used inside of a fui-dropdown');
    }
    const extraLeft: number = nested ? 20 : 0;

    super(injector, parentHost, null, extraLeft);

    if (!nested) {
      // Default positioning for normal dropdown is bottom-left
      this.anchorPoint = Point.BOTTOM_LEFT;
      this.popoverPoint = Point.LEFT_TOP;
    } else {
      // Default positioning for nested dropdown is right-top
      this.anchorPoint = Point.RIGHT_TOP;
      this.popoverPoint = Point.LEFT_TOP;
    }
    this.popoverOptions.allowMultipleOpen = true;
    this.closeOnOutsideClick = true;
  }

  isOpen(): boolean {
    return this.ifOpenService ? this.ifOpenService.open : false;
  }

  ngOnInit() {
    // If there is not enough space at the bottom of the element, we then try to open it to the top.
    const nearestScrollableParent: HTMLElement = this.getNearestScrollableParent(this.parentHost.nativeElement);
    const rect = this.parentHost.nativeElement.getBoundingClientRect();
    if (
      nearestScrollableParent &&
      nearestScrollableParent.scrollTop +
        rect.top +
        this.parentHost.nativeElement.clientHeight +
        this.el.nativeElement.clientHeight >=
        nearestScrollableParent.scrollTop + nearestScrollableParent.clientHeight
    ) {
      this.position = 'top-left';
    }

    if (this.appendTo) {
      this.appendPopover(this.appendTo);
    }
  }

  @Input('fuiPosition')
  set position(position: string) {
    // set the popover values based on menu position
    switch (position) {
      case 'top-right':
        this.anchorPoint = Point.TOP_RIGHT;
        this.popoverPoint = Point.RIGHT_BOTTOM;
        break;
      case 'top-left':
        this.anchorPoint = Point.TOP_LEFT;
        this.popoverPoint = Point.LEFT_BOTTOM;
        break;
      case 'bottom-right':
        this.anchorPoint = Point.BOTTOM_RIGHT;
        this.popoverPoint = Point.RIGHT_TOP;
        break;
      case 'bottom-left':
        this.anchorPoint = Point.BOTTOM_LEFT;
        this.popoverPoint = Point.LEFT_TOP;
        break;
      case 'right-top':
        this.anchorPoint = Point.RIGHT_TOP;
        this.popoverPoint = Point.LEFT_TOP;
        break;
      case 'right-bottom':
        this.anchorPoint = Point.RIGHT_BOTTOM;
        this.popoverPoint = Point.LEFT_BOTTOM;
        break;
      case 'left-top':
        this.anchorPoint = Point.LEFT_TOP;
        this.popoverPoint = Point.RIGHT_TOP;
        break;
      case 'left-bottom':
        this.anchorPoint = Point.LEFT_BOTTOM;
        this.popoverPoint = Point.RIGHT_BOTTOM;
        break;
      default:
        this.anchorPoint = Point.BOTTOM_LEFT;
        this.popoverPoint = Point.LEFT_TOP;
        break;
    }
  }

  private getNearestScrollableParent(element: HTMLElement): HTMLElement {
    const parent: HTMLElement = element.parentElement;
    if (parent) {
      const hasVerticalScrollbar: boolean = parent.style.overflow !== 'hidden' && this.isScrollable(parent);
      if (hasVerticalScrollbar) {
        return parent;
      } else {
        return this.getNearestScrollableParent(parent);
      }
    }
    return element;
  }

  private isScrollable(el: HTMLElement): boolean {
    const y1: number = el.scrollTop;
    el.scrollTop += 1;
    const y2: number = el.scrollTop;
    el.scrollTop -= 1;
    const y3: number = el.scrollTop;
    el.scrollTop = y1;
    return y1 !== y2 || y2 !== y3;
  }
}
