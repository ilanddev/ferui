import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
} from '@angular/core';
import { AbstractPopover } from '../popover/common/abstract-popover';
import { POPOVER_HOST_ANCHOR } from '../popover/common/popover-host-anchor.token';
import { Point } from '../popover/common/popover-options.interface';

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
export class FuiDropdownMenu extends AbstractPopover implements OnInit, OnDestroy, AfterViewInit {
  @Input() appendTo: string;
  @Input() parentContainer: HTMLElement | string;

  private forcedPosition: boolean;
  private readonly nested: FuiDropdownMenu;

  private _position: string;

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
      // Default positioning for normal dropdown is bottom-right
      this._position = 'bottom-left';
      this.anchorPoint = Point.BOTTOM_LEFT;
      this.popoverPoint = Point.LEFT_TOP;
    } else {
      this.nested = nested;
      // Default positioning for nested dropdown is right-top
      this._position = 'right-top';
      this.anchorPoint = Point.RIGHT_TOP;
      this.popoverPoint = Point.LEFT_TOP;
    }
    this.popoverOptions.allowMultipleOpen = true;
    this.closeOnOutsideClick = true;
    this.forcedPosition = false;
  }

  isOpen(): boolean {
    return this.ifOpenService ? this.ifOpenService.open : false;
  }

  ngOnInit() {
    if (this.appendTo) {
      this.appendPopover(this.appendTo);
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngAfterViewInit(): void {
    if (!this.forcedPosition && !this.nested) {
      // If there is not enough space at the bottom of the element, then try to open it to the top, same for left and right
      // We need to execute those checks after the view is initialized otherwise we don't have the good width and height
      // values since they are not set yet during the onInit life cycle.
      const host: HTMLElement = this.parentHost.nativeElement;
      const nearestYScrollableParent: HTMLElement = this.getNearestScrollableParent(host);

      if (nearestYScrollableParent) {
        const parentHeight: number = nearestYScrollableParent.scrollTop + nearestYScrollableParent.clientHeight;
        const parentWidth: number = nearestYScrollableParent.scrollLeft + nearestYScrollableParent.clientWidth;
        const positionRelativeToParent: { x: number; y: number } = this.getPositionRelativeTo(host, nearestYScrollableParent);
        const totalTopValue: number = positionRelativeToParent ? Math.round(positionRelativeToParent.y) : 0;
        const totalBottomValue: number = Math.round(parentHeight - (totalTopValue + host.clientHeight));
        const totalLeftValue: number = positionRelativeToParent ? Math.round(positionRelativeToParent.x) : 0;
        const totalRightValue: number = Math.round(parentWidth - (totalLeftValue + host.clientWidth));
        const clientWidth: number = this.el.nativeElement.offsetWidth;
        const clientHeight: number = this.el.nativeElement.offsetHeight;

        if (totalBottomValue >= clientHeight && totalRightValue >= clientWidth) {
          this.position = 'bottom-left';
        } else if (totalBottomValue >= clientHeight && totalRightValue < clientWidth) {
          this.position = 'bottom-right';
        } else if (totalBottomValue < clientHeight && totalRightValue >= clientWidth) {
          this.position = 'top-left';
        } else if (totalBottomValue < clientHeight && totalRightValue < clientWidth) {
          this.position = 'top-right';
        }
      }
    }
  }

  @Input('fuiPosition')
  set position(position: string) {
    this._position = position;
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
    this.forcedPosition = true;
  }

  get position(): string {
    return this._position;
  }

  private getNearestScrollableParent(element: HTMLElement, orientation: string = 'vertical'): HTMLElement {
    if (this.parentContainer) {
      if (this.isElement(this.parentContainer)) {
        return this.parentContainer as HTMLElement;
      } else {
        return document.querySelector(this.parentContainer as string);
      }
    }
    const parent: HTMLElement = element.parentElement;
    if (parent) {
      const parentStyle = window.getComputedStyle(parent);
      const split: string[] = parentStyle.getPropertyValue('overflow').split(' ');
      let overflowY: string = split[0];
      let overflowX: string = split[0];
      if (split.length > 1) {
        overflowY = split[1];
        overflowX = split[0];
      }
      const hasVerticalScrollbar: boolean = overflowY !== 'hidden' && this.isVerticallyScrollable(parent);
      const hasHorizontalScrollbar: boolean = overflowX !== 'hidden' && this.isHorizontallyScrollable(parent);
      if ((orientation === 'vertical' && hasVerticalScrollbar) || (orientation === 'horizontal' && hasHorizontalScrollbar)) {
        return parent;
      } else {
        return this.getNearestScrollableParent(parent);
      }
    }
    return element;
  }

  private getPositionRelativeTo(el: HTMLElement, parentEl: HTMLElement, maxLoops: number = 50): { x: number; y: number } {
    let currentElement: HTMLElement = el;
    let x: number = 0;
    let y: number = 0;
    while (currentElement !== parentEl && parentEl.contains(currentElement) && maxLoops > 0) {
      currentElement = currentElement.offsetParent as HTMLElement;
      if (currentElement) {
        const translateY: number = this.getComputedTranslateXY(currentElement).y;
        const translateX: number = this.getComputedTranslateXY(currentElement).x;
        if (translateY > currentElement.offsetTop) {
          y += translateY;
        } else {
          y += currentElement.offsetTop;
        }
        if (translateX > currentElement.offsetLeft) {
          x += translateX;
        } else {
          x += currentElement.offsetLeft;
        }
        maxLoops--;
      } else {
        maxLoops = 0;
      }
    }
    return { x: x, y: y };
  }

  private getComputedTranslateXY(obj: HTMLElement): { x: number; y: number } {
    if (window.getComputedStyle && obj) {
      const style = window.getComputedStyle(obj),
        transform = style.transform || style.webkitTransform;
      let mat = transform.match(/^matrix3d\((.+)\)$/);
      if (mat) {
        return {
          x: parseFloat(mat[1].split(', ')[12]),
          y: parseFloat(mat[1].split(', ')[13]),
        };
      }
      mat = transform.match(/^matrix\((.+)\)$/);
      if (mat) {
        return {
          x: parseFloat(mat[1].split(', ')[4]),
          y: parseFloat(mat[1].split(', ')[5]),
        };
      }
    }
    return {
      x: 0,
      y: 0,
    };
  }

  private isVerticallyScrollable(el: HTMLElement): boolean {
    const y1: number = el.scrollTop;
    el.scrollTop += 1;
    const y2: number = el.scrollTop;
    el.scrollTop -= 1;
    const y3: number = el.scrollTop;
    el.scrollTop = y1;
    return y1 !== y2 || y2 !== y3;
  }

  private isHorizontallyScrollable(el: HTMLElement): boolean {
    const x1: number = el.scrollLeft;
    el.scrollLeft += 1;
    const x2: number = el.scrollLeft;
    el.scrollLeft -= 1;
    const x3: number = el.scrollLeft;
    el.scrollLeft = x1;
    return x1 !== x2 || x2 !== x3;
  }

  //Returns true if it is a DOM element
  private isElement(o): boolean {
    return typeof HTMLElement === 'object'
      ? o instanceof HTMLElement //DOM2
      : o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';
  }
}
