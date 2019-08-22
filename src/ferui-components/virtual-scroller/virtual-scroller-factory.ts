import { VirtualScrollerDefaultOptions } from './types/virtual-scroller-interfaces';

export function VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY(): VirtualScrollerDefaultOptions {
  return {
    scrollThrottlingTime: 0,
    scrollDebounceTime: 0,
    scrollAnimationTime: 300, // 750
    checkResizeInterval: 1000,
    resizeBypassRefreshThreshold: 5,
    modifyOverflowStyleOfParentScroll: true,
    stripedTable: false,
  };
}
