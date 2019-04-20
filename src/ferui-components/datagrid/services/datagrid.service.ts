import { Injectable } from '@angular/core';
import { DatagridUtils } from '../utils/datagrid-utils';
import { BodyScrollEvent, FuiDatagridEvents } from '../events';
import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';
import { Observable, Subject } from 'rxjs';
import { FuiVirtualScrollerComponent } from '../../virtual-scroller/virtual-scroller';
import { FuiDatagridEventService } from './event.service';

@Injectable()
export class FuiDatagridService {
  private _isReady = new Subject<boolean>();

  private _eHeaderRoot: HTMLElement;
  private _eHeaderViewport: HTMLElement;
  private _eHeaderContainer: HTMLElement;

  private _virtualScrollViewport: FuiVirtualScrollerComponent;
  private _eBodyViewport: HTMLElement;
  private _eCenterContainer: HTMLElement;
  private _eCenterViewport: HTMLElement;
  private _eCenterColsClipper: HTMLElement;

  private _eHorizontalScrollBody: HTMLElement;
  private _eBodyHorizontalScrollViewport: HTMLElement;
  private _eBodyHorizontalScrollContainer: HTMLElement;
  private _lastHorizontalScrollElement: HTMLElement | undefined | null;

  private _eFullWidthContainer: HTMLElement;

  private scrollLeft: number = -1;
  private scrollTop: number = -1;

  constructor(
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private eventService: FuiDatagridEventService
  ) {}

  get virtualScrollViewport(): FuiVirtualScrollerComponent {
    return this._virtualScrollViewport;
  }

  set virtualScrollViewport(value: FuiVirtualScrollerComponent) {
    this._virtualScrollViewport = value;
  }

  get eHeaderRoot(): HTMLElement {
    return this._eHeaderRoot;
  }

  set eHeaderRoot(value: HTMLElement) {
    this._eHeaderRoot = value;
    this.checkIfReady();
  }

  get eBodyViewport(): HTMLElement {
    return this._eBodyViewport;
  }

  set eBodyViewport(value: HTMLElement) {
    this._eBodyViewport = value;
    this.checkIfReady();
  }

  get eCenterContainer(): HTMLElement {
    return this._eCenterContainer;
  }

  set eCenterContainer(value: HTMLElement) {
    this._eCenterContainer = value;
    this.checkIfReady();
  }

  get eCenterViewport(): HTMLElement {
    return this._eCenterViewport;
  }

  set eCenterViewport(value: HTMLElement) {
    this._eCenterViewport = value;
    this.checkIfReady();
  }

  get eCenterColsClipper(): HTMLElement {
    return this._eCenterColsClipper;
  }

  set eCenterColsClipper(value: HTMLElement) {
    this._eCenterColsClipper = value;
    this.checkIfReady();
  }

  get eHorizontalScrollBody(): HTMLElement {
    return this._eHorizontalScrollBody;
  }

  set eHorizontalScrollBody(value: HTMLElement) {
    this._eHorizontalScrollBody = value;
    this.checkIfReady();
  }

  get eBodyHorizontalScrollViewport(): HTMLElement {
    return this._eBodyHorizontalScrollViewport;
  }

  set eBodyHorizontalScrollViewport(value: HTMLElement) {
    this._eBodyHorizontalScrollViewport = value;
    this.checkIfReady();
  }

  get eBodyHorizontalScrollContainer(): HTMLElement {
    return this._eBodyHorizontalScrollContainer;
  }

  set eBodyHorizontalScrollContainer(value: HTMLElement) {
    this._eBodyHorizontalScrollContainer = value;
    this.checkIfReady();
  }

  get eHeaderViewport(): HTMLElement {
    return this._eHeaderViewport;
  }

  set eHeaderViewport(value: HTMLElement) {
    this._eHeaderViewport = value;
    this.checkIfReady();
  }

  get eHeaderContainer(): HTMLElement {
    return this._eHeaderContainer;
  }

  set eHeaderContainer(value: HTMLElement) {
    this._eHeaderContainer = value;
    this.checkIfReady();
  }

  get lastHorizontalScrollElement(): HTMLElement | undefined | null {
    return this._lastHorizontalScrollElement;
  }

  set lastHorizontalScrollElement(value: HTMLElement | undefined | null) {
    this._lastHorizontalScrollElement = value;
  }

  get eFullWidthContainer(): HTMLElement {
    return this._eFullWidthContainer;
  }

  set eFullWidthContainer(value: HTMLElement) {
    this._eFullWidthContainer = value;
    this.checkIfReady();
  }

  get isReady(): Observable<boolean> {
    return this._isReady.asObservable();
  }

  // used by autoWidthCalculator and autoHeightCalculator
  getCenterContainer(): HTMLElement {
    return this._eCenterContainer;
  }

  getDropTargetBodyContainers(): HTMLElement[] {
    return [this._eCenterViewport];
  }

  getCenterViewportScrollLeft(): number {
    // we defer to a util, as how you calculated scrollLeft when doing RTL depends on the browser
    return DatagridUtils.getScrollLeft(this._eCenterViewport, false);
  }

  getCenterWidth(): number {
    return this._eCenterViewport.clientWidth;
  }

  setHorizontalScrollPosition(hScrollPosition: number): void {
    this.doHorizontalScroll(hScrollPosition);
  }

  scrollHorizontally(pixels: number): number {
    const oldScrollPosition = this.eCenterViewport.scrollLeft;

    this.setHorizontalScrollPosition(oldScrollPosition + pixels);
    return this.eCenterViewport.scrollLeft - oldScrollPosition;
  }

  horizontallyScrollHeaderCenterAndFloatingCenter(scrollLeft?: number): void {
    if (scrollLeft === undefined) {
      scrollLeft = this.getCenterViewportScrollLeft();
    }

    const offset = -scrollLeft;
    const { clientWidth, scrollWidth } = this._eCenterViewport;
    const scrollWentPastBounds = Math.abs(offset) + clientWidth > scrollWidth;

    if (scrollWentPastBounds || offset > 0) {
      return;
    }

    DatagridUtils.setScrollLeft(this._eHeaderViewport, scrollLeft, false);
    DatagridUtils.setScrollLeft(this._eCenterViewport, scrollLeft, false);
  }

  private doHorizontalScroll(scrollLeft: number): void {
    this.scrollLeft = scrollLeft;

    const event: BodyScrollEvent = {
      type: FuiDatagridEvents.EVENT_BODY_SCROLL,
      api: this.gridApi,
      columnApi: this.columnApi,
      direction: 'horizontal',
      left: this.scrollLeft,
      top: this.scrollTop,
    };
    this.eventService.dispatchEvent(event);
    this.horizontallyScrollHeaderCenterAndFloatingCenter(scrollLeft);
  }

  private checkIfReady(): void {
    if (
      this.eHeaderRoot &&
      this.eBodyViewport &&
      this.eCenterContainer &&
      this.eHeaderViewport &&
      this.eCenterViewport &&
      this.eCenterColsClipper &&
      this.eHorizontalScrollBody &&
      this.eHeaderContainer &&
      this.eBodyHorizontalScrollViewport &&
      this.eBodyHorizontalScrollContainer &&
      this.eFullWidthContainer &&
      this.virtualScrollViewport
    ) {
      this.setReady();
    }
  }

  private setReady(): void {
    this._isReady.next(true);
  }
}
