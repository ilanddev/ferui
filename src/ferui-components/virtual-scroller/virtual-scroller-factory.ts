import { VirtualScrollerDefaultOptions } from './types/virtual-scroller-interfaces';
import { InjectionToken } from '@angular/core';

export const VIRTUAL_SCROLLER_DEFAULT_OPTIONS = new InjectionToken<string>('virtual_scroller_default_options');

export function VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY(): VirtualScrollerDefaultOptions {
  return {
    scrollThrottlingTime: 0,
    scrollDebounceTime: 0,
    scrollAnimationTime: 300, // 750
    checkResizeInterval: 1000,
    resizeBypassRefreshThreshold: 5,
    modifyOverflowStyleOfParentScroll: true,
    stripedTable: false,
    pxErrorValue: 1 // By default we assume that the height of the viewport is equal to the sum of all rows inside.
    // But in some cases, we want to fake the height and use another value.
    // i.e : For datagrid we have borders on each rows, but we don't want to display the last row so we need to remove one px
    // to the viewport height. We need to let the virtual scroller that we are faking the height by one px. The px error
    // value will then need to be equal to 0.
  };
}
