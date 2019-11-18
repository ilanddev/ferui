import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class ScrollbarHelper {
  private readonly width: number = null;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.width = this.getWidth();
  }

  getWidth(): number {
    if (this.width !== null) {
      return this.width;
    }
    const outer = this.document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar';
    this.document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = this.document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
