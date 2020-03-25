export interface WrapGroupDimensions {
  numberOfKnownWrapGroupChildSizes: number;
  sumOfKnownWrapGroupChildWidths: number;
  sumOfKnownWrapGroupChildHeights: number;
  maxChildSizePerWrapGroup: WrapGroupDimension[];
}

export interface WrapGroupDimension {
  childWidth: number;
  childHeight: number;
  items: any[];
}

export interface IDimensions {
  itemCount: number;
  itemsPerWrapGroup: number;
  wrapGroupsPerPage: number;
  itemsPerPage: number;
  pageCount_fractional: number;
  childWidth: number;
  childHeight: number;
  scrollLength: number;
  viewportLength: number;
  maxScrollPosition: number;
}

export interface IPageInfo {
  startIndex: number;
  endIndex: number;
  scrollStartPosition: number;
  scrollEndPosition: number;
  startIndexWithBuffer: number;
  endIndexWithBuffer: number;
  maxScrollPosition: number;
}

export interface IViewport extends IPageInfo {
  padding: number;
  scrollLength: number;
}

export interface VirtualScrollerDefaultOptions {
  scrollThrottlingTime?: number;
  scrollDebounceTime?: number;
  scrollAnimationTime?: number;
  scrollbarWidth?: number;
  scrollbarHeight?: number;
  checkResizeInterval?: number;
  resizeBypassRefreshThreshold?: number;
  modifyOverflowStyleOfParentScroll?: boolean;
  stripedTable?: boolean;
  pxErrorValue?: number;
}
