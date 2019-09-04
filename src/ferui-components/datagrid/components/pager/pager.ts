import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Self } from '@angular/core';
import { FuiCommonStrings } from '../../../utils/i18n/common-strings.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { Subscription } from 'rxjs';
import {
  FuiDatagridEvents,
  FuiFilterEvent,
  FuiPageChangeEvent,
  RowDataChanged,
  ServerSideRowDataChanged,
} from '../../events';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridServerSideRowModel } from '../row-models/server-side-row-model';
import { FuiPagerPage } from '../../types/pager';
import { orderByComparator } from '../../utils/sort';
import { FuiRowModel } from '../../types/row-model.enum';
import { DatagridUtils } from '../../utils/datagrid-utils';
import { FuiDatagridInfinteRowModel } from '../row-models/infinite/infinite-row-model';

@Component({
  selector: 'fui-datagrid-pager',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto">
          <div class="fui-datagrid-pager-total" *ngIf="totalRows !== null">{{ totalRows }} {{ commonStrings.total }}</div>
          <div class="fui-datagrid-pager-total" *ngIf="totalRows === null">
            {{ startIndex + 1 }} to {{ endIndex + 1 }} of {{ serverSideTotalRows }}
          </div>
        </div>
        <div class="col">
          <div class="fui-datagrid-pagination" *ngIf="!isLoading">
            <clr-icon
              class="fui-pagination-arrow"
              (click)="toFirstPage()"
              [class.disabled]="isPageDisabled('first')"
              shape="fui-step-forward"
              flip="horizontal"
            ></clr-icon>
            <clr-icon
              class="fui-pagination-arrow"
              (click)="toPreviousPage()"
              [class.disabled]="isPageDisabled('previous')"
              shape="fui-caret"
              dir="left"
            ></clr-icon>
            <div class="fui-datagrid-pagination-pages" *ngIf="displayedPages().length > 0">
              <div
                unselectable="on"
                class="fui-datagrid-pagination-page"
                (click)="pageSelect(page)"
                [class.page-selected]="isPageSelected(page)"
                *ngFor="let page of displayedPages()"
              >
                {{ page.value }}
              </div>
            </div>
            <clr-icon
              class="fui-pagination-arrow"
              (click)="toNextPage()"
              [class.disabled]="isPageDisabled('next')"
              shape="fui-caret"
              dir="right"
            ></clr-icon>
            <clr-icon
              class="fui-pagination-arrow"
              (click)="toLastPage()"
              [class.disabled]="isPageDisabled('last')"
              shape="fui-step-forward"
            ></clr-icon>
          </div>
        </div>
        <div class="col-auto item-per-page-selector" *ngIf="customNumberPageSelection">
          <fui-select
            [layout]="'small'"
            fuiSelect
            name="itemPerPage"
            [clearable]="false"
            placeholder="Item per page"
            (ngModelChange)="updateLimit($event)"
            [(ngModel)]="itemPerPage"
          >
            <ng-option *ngFor="let itemPerPage of itemPerPagesList" [value]="itemPerPage">
              {{ itemPerPage }} items per page
            </ng-option>
          </fui-select>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-pager',
  },
})
export class FuiDatagridPager implements OnInit, OnDestroy {
  @Output() pagerReset: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() customNumberPageSelection: boolean = false;
  @Input() numberOfPages: number = 5;
  @Input() isLoading: boolean = false;
  @Input() rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;

  numberOfRowsInViewport: number | null = null;
  totalRows: number | null = null;
  height: number;
  pages: FuiPagerPage[] = [];
  lastPageIndex: number = 0;
  maxPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  maxIndex: number = 0;

  serverSideTotalRows: string = 'more';

  itemPerPage: number;
  itemPerPagesList: number[] = [5, 10, 20, 50, 100];

  private _selectedPage: FuiPagerPage;

  private subscriptions: Subscription[] = [];
  private serverSideReachLastPage: boolean = false;
  private serverSidePages: FuiPagerPage[] = [];
  private serverSideLoading: boolean = false;

  constructor(
    @Self() public elementRef: ElementRef,
    public commonStrings: FuiCommonStrings,
    private eventService: FuiDatagridEventService,
    private gridPanel: FuiDatagridService,
    private serverSideRowModel: FuiDatagridServerSideRowModel,
    private infiniteRowModel: FuiDatagridInfinteRowModel
  ) {}

  get selectedPage(): FuiPagerPage {
    return this._selectedPage;
  }

  set selectedPage(value: FuiPagerPage) {
    if (!this._selectedPage || (this._selectedPage && value.index !== this._selectedPage.index)) {
      this._selectedPage = value;
      const event: FuiPageChangeEvent = {
        api: null,
        columnApi: null,
        page: this._selectedPage,
        type: FuiDatagridEvents.EVENT_PAGER_SELECTED_PAGE,
      };
      this.eventService.dispatchEvent(event);
    }
  }

  ngOnInit(): void {
    this.height = this.elementRef.nativeElement.getBoundingClientRect().height;
    if (this.serverSideRowModel.limit && this.itemPerPagesList.indexOf(this.serverSideRowModel.limit) === -1) {
      this.itemPerPagesList.push(this.serverSideRowModel.limit);
      this.itemPerPagesList.sort(orderByComparator);
    }
    this.itemPerPage = this.serverSideRowModel.limit;

    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED).subscribe(event => {
        const ev: ServerSideRowDataChanged = event as ServerSideRowDataChanged;
        if (ev.resultObject) {
          this.totalRows = ev.resultObject.total ? ev.resultObject.total : null;
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_DATA_CHANGED).subscribe(event => {
        const ev = event as RowDataChanged;
        if (ev.rowData) {
          if (ev.totalRows) {
            this.totalRows = ev.totalRows ? ev.totalRows : null;
          } else {
            this.totalRows = ev.rowData.length;
          }
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_FILTER_CHANGED).subscribe(event => {
        const ev: FuiFilterEvent = event as FuiFilterEvent;
        this.resetPager();
        this.totalRows = ev.totalRows ? ev.totalRows : null;
        if (ev.filteredRows) {
          this.numberOfRowsInViewport = 0;
          this.gridPanel.virtualScrollViewport.ngDoCheck();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(event => {
        this.resetPager();
        this.gridPanel.virtualScrollViewport.ngDoCheck();
      }),
      this.gridPanel.isReady.subscribe(isReady => {
        if (isReady) {
          this.subscriptions.push(
            this.gridPanel.virtualScrollViewport.vsStart.subscribe(pageInfo => {
              if (this.isServerSideRowModel()) {
                this.startIndex = this.serverSideRowModel.offset;
                this.endIndex = this.startIndex + this.serverSideRowModel.limit - 1; // The index is 0 based.
              } else {
                this.startIndex = pageInfo.startIndex;
                this.endIndex = pageInfo.endIndex;
              }

              if (this.endIndex > this.maxIndex) {
                this.maxIndex = this.endIndex;
              }

              if (
                (this.numberOfRowsInViewport === 0 || this.numberOfRowsInViewport === null) &&
                this.startIndex > -1 &&
                this.endIndex > 0 &&
                this.totalRows !== null &&
                this.totalRows > 0
              ) {
                this.numberOfRowsInViewport = this.serverSideRowModel.datasource
                  ? this.serverSideRowModel.limit
                  : this.endIndex - this.startIndex + 1;
                let totalPages: number = Math.ceil(this.totalRows / this.numberOfRowsInViewport);
                if (totalPages === 0) {
                  totalPages = 1;
                }
                this.maxPages = totalPages > this.numberOfPages ? this.numberOfPages : totalPages;

                for (let i = 1; i <= totalPages; i++) {
                  const lastIndex: number = i * this.numberOfRowsInViewport;
                  const firstIndex: number = lastIndex - this.numberOfRowsInViewport;
                  this.addPage(i, firstIndex, lastIndex - 1);
                }
              } else if ((this.totalRows === 0 || this.totalRows === null) && this.startIndex > -1 && this.endIndex > 0) {
                this.numberOfRowsInViewport = this.totalRows;
                const startIdx: number = this.startIndex;
                const endIdx: number = this.endIndex;

                if (this.isInfiniteServerSideRowModel() && this.infiniteRowModel) {
                  const numberOfRowsInViewport: number = this.infiniteRowModel.limit;
                  const maxReachedRowIndex: number = this.infiniteRowModel.infiniteCache.maxReachedRowIndex;
                  let totalPages: number = Math.ceil(maxReachedRowIndex / numberOfRowsInViewport);
                  if (totalPages === 0) {
                    totalPages = 1;
                  }
                  if (this.pages.length !== totalPages) {
                    this.pages = [];
                    for (let i = 0; i < totalPages; i++) {
                      const firstIndex: number = numberOfRowsInViewport * i;
                      const lastIndex: number = firstIndex + numberOfRowsInViewport - 1;
                      this.addPage(i + 1, firstIndex, lastIndex);
                    }
                  }
                  if (this.infiniteRowModel.infiniteCache.reachedLastIndex) {
                    this.reachedLastPage((maxReachedRowIndex + 1).toString());
                  }
                } else {
                  this.pages = this.isServerSideRowModel() ? [...this.serverSidePages] : [];
                  this.addPage(
                    this.getPageNumberFromEndIndex(this.startIndex + 1, this.serverSideRowModel.limit),
                    startIdx,
                    endIdx
                  );
                }
                this.maxPages = this.pages.length + 1 > this.numberOfPages ? this.numberOfPages : this.pages.length + 1;
              }
              this.setSelectedPage();
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  isPageSelected(page: FuiPagerPage): boolean {
    return DatagridUtils.inRange(this.startIndex, page.startIndex, page.endIndex);
  }

  pageSelect(page: FuiPagerPage, startIndex: boolean = true): void {
    if (this.gridPanel.virtualScrollViewport && page) {
      this.selectedPage = page;
      const isLastPage = !startIndex || this.lastPageIndex === page.index + 1;

      if (this.isServerSideRowModel()) {
        this.goToPage(false, page);
      } else {
        this.goToPage(true, page, isLastPage);
      }
    }
  }

  isPageDisabled(type: string): boolean {
    if (!this.selectedPage || this.pages.length === 0) {
      return false;
    }
    switch (type) {
      case 'first':
      case 'previous':
        return this.selectedPage.index === 0;
      case 'last':
      case 'next':
        const isDisabled: boolean = this.selectedPage.index === this.pages[this.pages.length - 1].index;
        return this.isServerSideRowModel() ? this.serverSideReachLastPage && isDisabled : isDisabled;
      default:
        return false;
    }
  }

  toFirstPage(): void {
    if (this.selectedPage.index === 0) {
      return;
    }
    this.pageSelect(this.pages[0]);
  }

  toLastPage(): void {
    if (this.selectedPage.index === this.pages[this.pages.length - 1].index) {
      return;
    }
    this.pageSelect(this.pages[this.pages.length - 1], false);
  }

  toNextPage(): void {
    if (
      ((this.isServerSideRowModel() || this.isInfiniteServerSideRowModel()) &&
        this.serverSideReachLastPage &&
        this.selectedPage.index + 1 > this.pages.length - 1) ||
      (this.isClientSideRowModel() && this.selectedPage.index + 1 > this.pages.length - 1)
    ) {
      return;
    }
    this.pageSelect(this.getNextPage());
  }

  toPreviousPage(): void {
    if (this.selectedPage.index - 1 < 0) {
      return;
    }
    this.pageSelect(this.pages[this.selectedPage.index - 1]);
  }

  displayedPages(): FuiPagerPage[] {
    if (this.pages.length === 0 || !this.selectedPage) {
      return [];
    }
    const halfPage = Math.ceil(this.maxPages / 2);
    const calc = this.selectedPage.value - halfPage;
    const pageIndexed =
      calc < 0 ? 0 : this.selectedPage.value >= this.lastPageIndex - halfPage ? this.lastPageIndex - this.maxPages : calc;
    return [...this.pages].slice(pageIndexed < 0 ? 0 : pageIndexed, pageIndexed + this.maxPages);
  }

  serverSidePageChange(pageIndex: number, limit: number): void {
    this.serverSideRowModel.offset = pageIndex;
    this.serverSideRowModel.limit = limit;
    this.numberOfRowsInViewport = null;
    this.serverSideLoading = true;
    // For infinite scrolling, the updateRows function will automatically take the buffer value into account.
    this.serverSideRowModel
      .updateRows(false, pageIndex)
      .then(resultObject => {
        if (resultObject.data === null) {
          this.reachedLastPage(pageIndex.toString());
          this.toPreviousPage();
        }
        this.serverSideLoading = false;
        const currentPage = this.findPageFromStartIndex(pageIndex);
        if (currentPage) {
          this.pages[currentPage.index].serverSidePageLoaded = true;
        }
      })
      .catch(reason => {
        this.serverSideLoading = false;
        throw Error(reason);
      });
  }

  getCurrentPage(): FuiPagerPage {
    return this.selectedPage;
  }

  updateLimit(value: number): void {
    this.resetPager();
    this.itemPerPage = value;
    this.serverSidePageChange(0, value);
  }

  resetPager(): void {
    this.pages = [];
    this.lastPageIndex = 0;
    this.maxPages = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    this.maxIndex = 0;
    this._selectedPage = null;

    if (this.isServerSideRowModel()) {
      this.serverSideReachLastPage = false;
      this.serverSideTotalRows = 'more';
      if (this.serverSidePages.length > 0) {
        this.serverSidePages = [];
      }
    }
    this.pagerReset.emit(true);
  }

  private reachedLastPage(total: string) {
    this.serverSideReachLastPage = true;
    this.serverSideTotalRows = total;
  }

  /**
   *
   * @param index Start from 1.
   * @param firstIndex
   * @param lastIndex
   */
  private addPage(index: number, firstIndex: number, lastIndex: number): void {
    // Do nothing if the page already exist
    if (
      this.isPageExist(index) ||
      (this.pages.length > 0 &&
        (this.pages[this.pages.length - 1].startIndex === firstIndex ||
          this.pages[this.pages.length - 1].endIndex === lastIndex))
    ) {
      return;
    }
    const page: FuiPagerPage = {
      index: index - 1, // start from 0
      value: index, // start from 1
      startIndex: firstIndex, // start from 0
      endIndex: lastIndex,
      serverSidePageLoaded: false,
    };
    this.pages.push(page);
    if (this.isServerSideRowModel() && this.totalRows === null) {
      this.serverSidePages.push(page);
    }
    this.lastPageIndex = index;
  }

  private setSelectedPage(): void {
    this.selectedPage = this.pages.find(p => {
      return this.isPageSelected(p);
    });
  }

  private isServerSideRowModel(): boolean {
    return !!this.serverSideRowModel.datasource && this.rowDataModel === FuiRowModel.SERVER_SIDE;
  }

  private isInfiniteServerSideRowModel(): boolean {
    return !!this.serverSideRowModel.datasource && this.rowDataModel === FuiRowModel.INFINITE;
  }

  private isClientSideRowModel(): boolean {
    return this.rowDataModel === FuiRowModel.CLIENT_SIDE;
  }

  private getNextPage(): FuiPagerPage {
    if (!this.selectedPage) {
      return null;
    }
    if (this.isServerSideRowModel()) {
      return {
        index: this.selectedPage.index + 1,
        value: this.selectedPage.value + 1,
        startIndex: this.selectedPage.endIndex + 1,
        endIndex: this.selectedPage.endIndex + this.serverSideRowModel.limit,
        serverSidePageLoaded: false,
      };
    } else {
      return this.pages[this.selectedPage.index + 1];
    }
  }

  private findPageFromStartIndex(startIndex: number): FuiPagerPage {
    return this.pages.find(p => p.startIndex === startIndex);
  }

  private goToPage(clientChange: boolean, page: FuiPagerPage, isLastPage?: boolean): void {
    if (clientChange) {
      this.gridPanel.virtualScrollViewport.scrollToIndex(isLastPage ? page.endIndex : page.startIndex, true, 0, 0);
    } else {
      this.serverSidePageChange(page.startIndex, this.serverSideRowModel.limit);
    }
  }

  private isPageExist(index: number): boolean {
    return this.pages.findIndex(p => p.value === index) > -1;
  }

  private getPageNumberFromEndIndex(index: number, limit: number): number {
    return Math.ceil(index / limit);
  }
}
