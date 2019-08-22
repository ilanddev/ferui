import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { RowRendererService } from '../services/rendering/row-renderer.service';
import { FuiColumnDefinitions } from '../types/column-definitions';
import { FuiDatagridApiService } from '../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../services/datagrid-column-api.service';
import { FuiDatagridOptionsWrapperService } from '../services/datagrid-options-wrapper.service';
import { FuiColumnService } from '../services/rendering/column.service';
import { Column } from './entities/column';
import { ColumnUtilsService } from '../utils/column-utils.service';
import { ScrollbarHelper } from '../services/datagrid-scrollbar-helper.service';
import { FuiDatagridSortService } from '../services/datagrid-sort.service';
import { Subscription } from 'rxjs';
import {
  CellClickedEvent,
  CellContextMenuEvent,
  CellDoubleClickedEvent,
  ColumnEvent,
  ColumnMovedEvent,
  DisplayedColumnsWidthChangedEvent,
  FuiDatagridEvents,
  FuiPageChangeEvent,
  FuiSortColumnsEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
  ServerSideRowDataChanged,
} from '../events';
import { FuiDatagridDragAndDropService } from '../services/datagrid-drag-and-drop.service';
import { FuiDragEventsService } from '../services/datagrid-drag-events.service';
import { FuiDatagridService } from '../services/datagrid.service';
import { FuiDatagridFilters } from './filters/filters';
import { FuiDatagridPager } from './pager/pager';
import { FuiDatagridEventService } from '../services/event.service';
import { FuiDatagridClientSideRowModel } from './row-models/client-side-row-model';
import { FuiDatagridFilterService } from '../services/datagrid-filter.service';
import { FuiVirtualScrollerComponent } from '../../virtual-scroller/virtual-scroller';
import { FuiRowModel } from '../types/row-model.enum';
import { FuiDatagridServerSideRowModel } from './row-models/server-side-row-model';
import { IDatagridResultObject, IServerSideDatasource } from '../types/server-side-row-model';
import { ColumnKeyCreator } from '../services/column-key-creator';
import { FuiDatagridInfinteRowModel } from './row-models/infinite/infinite-row-model';
import { AutoWidthCalculator } from '../services/rendering/autoWidthCalculator';
import { HeaderRendererService } from '../services/rendering/header-renderer.service';

@Component({
  selector: 'fui-datagrid',
  template: `
    <fui-datagrid-filters [isLoading]="isInitialLoading"></fui-datagrid-filters>
    <div class="fui-datagrid-root-wrapper" #rootWrapper>
      <div class="fui-datagrid-root-body-wrapper">
        <div class="fui-datagrid-root-body" role="grid" unselectable="on">
          <fui-datagrid-header unselectable="on" [style.height.px]="rowHeight" [style.min-height.px]="rowHeight">
            <fui-datagrid-header-viewport>
              <fui-datagrid-header-container [style.width.px]="totalWidth + scrollSize">
                <fui-datagrid-header-row [style.width.px]="totalWidth + scrollSize">
                  <fui-datagrid-header-cell
                    unselectable="on"
                    *ngFor="let column of columns; trackBy: columnTrackbyFn; let i = index"
                    [colIndex]="i"
                    (resize)="onColumnResized()"
                    (dragColumnsChange)="onColumnsChange($event)"
                    [rowHeight]="rowHeight"
                    [columnDefinition]="column"
                  ></fui-datagrid-header-cell>
                </fui-datagrid-header-row>
              </fui-datagrid-header-container>
            </fui-datagrid-header-viewport>
          </fui-datagrid-header>

          <fui-datagrid-body
            [isLoading]="isInitialLoading || (isLoading && !isInfiniteServerSideRowModel())"
            [headerHeight]="rowHeight"
            unselectable="on"
          >
            <fui-virtual-scroller
              #scroll
              [bufferAmount]="virtualScrollBufferAmount"
              (scroll)="onCenterViewportScroll()"
              [items]="displayedRows"
              class="fui-datagrid-body-viewport"
              role="presentation"
              unselectable="on"
            >
              <fui-datagrid-body-row
                *ngFor="let row of scroll.viewPortItems; trackBy: rowTrackbyFn; let i = index"
                [data]="row"
                [rowIndex]="i + scroll.viewPortInfo.startIndex"
                [style.width.px]="totalWidth"
              >
                <fui-datagrid-body-cell
                  *ngFor="let column of getVisibleColumns(); trackBy: columnTrackbyFn"
                  unselectable="on"
                  [column]="column"
                  [rowIndex]="i + scroll.viewPortInfo.startIndex"
                  [rowHeight]="rowHeight"
                  [rowData]="row"
                ></fui-datagrid-body-cell>
              </fui-datagrid-body-row>
            </fui-virtual-scroller>
            <div
              class="fui-datagrid-infinite-loader"
              *ngIf="isLoading && isInfiniteServerSideRowModel()"
              [style.width]="'calc(100% - ' + scrollSize + 'px)'"
              [style.bottom.px]="scrollSize"
            ></div>
          </fui-datagrid-body>

          <div class="fui-datagrid-footer" role="presentation"></div>

          <div
            class="fui-datagrid-horizontal-scroll"
            #horizontalScrollBody
            [style.height.px]="scrollSize"
            [style.min-height.px]="scrollSize"
            [style.max-height.px]="scrollSize"
          >
            <div
              class="fui-datagrid-body-horizontal-scroll-viewport"
              #horizontalScrollViewport
              (scroll)="onFakeHorizontalScroll()"
              [style.height.px]="scrollSize"
              [style.min-height.px]="scrollSize"
              [style.max-height.px]="scrollSize"
            >
              <div
                class="fui-datagrid-body-horizontal-scroll-container"
                #horizontalScrollContainer
                [style.width.px]="totalWidth"
                [style.height.px]="scrollSize"
                [style.min-height.px]="scrollSize"
                [style.max-height.px]="scrollSize"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="fui-datagrid-pager-wrapper"></div>
    </div>
    <fui-datagrid-pager
      [rowDataModel]="rowDataModel"
      [isLoading]="isInitialLoading"
      (pagerReset)="pagerReset($event)"
      [customNumberPageSelection]="isServerOrInfiniteRowModel()"
    >
    </fui-datagrid-pager>

    <clr-icon #iconDelete class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-delete" shape="fui-trash"></clr-icon>
    <clr-icon #iconMove class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-move" shape="fui-dragndrop"></clr-icon>
    <clr-icon
      #iconLeft
      class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-left"
      shape="fui-arrow-thin"
      dir="left"
    ></clr-icon>
    <clr-icon
      #iconRight
      class="fui-datagrid-dragdrop-icon fui-datagrid-dragdrop-right"
      shape="fui-arrow-thin"
      dir="right"
    ></clr-icon>
  `,
  host: {
    class: 'fui-datagrid',
    '[class.fui-datagrid-has-filter]': 'datagridFilters !== undefined',
    '[class.fui-datagrid-has-pager]': 'datagridPager !== undefined',
  },
  providers: [
    AutoWidthCalculator,
    HeaderRendererService,
    ColumnKeyCreator,
    ColumnUtilsService,
    RowRendererService,
    FuiDatagridApiService,
    FuiDatagridColumnApiService,
    FuiDatagridOptionsWrapperService,
    FuiColumnService,
    ScrollbarHelper,
    FuiDragEventsService,
    FuiDatagridDragAndDropService,
    FuiDatagridSortService,
    FuiDatagridService,
    FuiDatagridEventService,
    FuiDatagridFilterService,
    FuiDatagridClientSideRowModel,
    FuiDatagridServerSideRowModel,
    FuiDatagridInfinteRowModel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiDatagrid implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Output() onRowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() onRowDoubleClicked: EventEmitter<RowDoubleClickedEvent> = new EventEmitter<RowDoubleClickedEvent>();
  @Output() onCellClicked: EventEmitter<CellClickedEvent> = new EventEmitter<CellClickedEvent>();
  @Output() onCellDoubleClicked: EventEmitter<CellDoubleClickedEvent> = new EventEmitter<CellDoubleClickedEvent>();
  @Output() onCellContextmenu: EventEmitter<CellContextMenuEvent> = new EventEmitter<CellContextMenuEvent>();

  @Input() columnDefs: Array<FuiColumnDefinitions> = [];
  @Input() defaultColDefs: FuiColumnDefinitions = {};
  @Input() headerHeight: number = 50; // In px.
  @Input() rowHeight: number = 50; // In px.
  @Input('isLoading') isInitialLoading: boolean = false;
  @Input() datasource: IServerSideDatasource;
  @Input() trackByFn: TrackByFunction<any>;
  @Input('vsBufferAmount') virtualScrollBufferAmount: number = 10;

  @ViewChild('horizontalScrollBody') horizontalScrollBody: ElementRef;
  @ViewChild('horizontalScrollViewport') horizontalScrollViewport: ElementRef;
  @ViewChild('horizontalScrollContainer') horizontalScrollContainer: ElementRef;
  @ViewChild('rootWrapper') rootWrapper: ElementRef;
  @ViewChild('iconMove') iconMove: ElementRef;
  @ViewChild('iconDelete') iconDelete: ElementRef;
  @ViewChild('iconLeft') iconLeft: ElementRef;
  @ViewChild('iconRight') iconRight: ElementRef;
  @ViewChild('scroll') viewport: FuiVirtualScrollerComponent;

  @ViewChild(FuiDatagridFilters) datagridFilters: FuiDatagridFilters;
  @ViewChild(FuiDatagridPager) datagridPager: FuiDatagridPager;

  columns: FuiColumnDefinitions[] = [];
  totalWidth: number;
  scrollSize: number = 0;
  isLoading: boolean = false;

  private _rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  private _gridWidth: string = '100%';
  private _gridHeight: string = 'auto';
  private _rowData: any[] = [];
  private _displayedRows: any[] = [];
  private _maxDisplayedRows: number = null;
  private columnDraggingAnimationTimeout = null;
  private columnDraggingAnimationDelay: number = 200; // 0.2s or 200ms
  private gridPanelReady: boolean = false;
  private totalRows: number = 0;
  private headerPagerHeight: number = 0;
  private isAutoGridHeight: boolean = true;
  private userGridHeight: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private rowRendererService: RowRendererService,
    private datagridOptionsWrapper: FuiDatagridOptionsWrapperService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private columnUtils: ColumnUtilsService,
    private scrollbarHelper: ScrollbarHelper,
    private sortService: FuiDatagridSortService,
    private filterService: FuiDatagridFilterService,
    private columnService: FuiColumnService,
    private gridPanel: FuiDatagridService,
    private dragAndDropService: FuiDatagridDragAndDropService,
    private eventService: FuiDatagridEventService,
    private clientSideRowModel: FuiDatagridClientSideRowModel,
    private serverSideRowModel: FuiDatagridServerSideRowModel,
    private infiniteRowModel: FuiDatagridInfinteRowModel
  ) {}

  getGridApi(): FuiDatagridApiService {
    return this.gridApi;
  }

  getColumnApi(): FuiDatagridColumnApiService {
    return this.columnApi;
  }

  @Input()
  set rowDataModel(value: FuiRowModel) {
    this._rowDataModel = value;
    this.datagridOptionsWrapper.rowDataModel = value;
    this.cd.markForCheck();
  }

  get rowDataModel(): FuiRowModel {
    return this._rowDataModel;
  }

  @Input()
  set maxDisplayedRows(value: number) {
    this._maxDisplayedRows = value;
    this.inputGridHeight = this.gridHeight;
    this.cd.markForCheck();
  }

  get maxDisplayedRows(): number {
    return this._maxDisplayedRows;
  }

  @HostBinding('style.height')
  get gridHeight(): string {
    return this._gridHeight;
  }

  @Input('gridHeight')
  set inputGridHeight(value: string) {
    if (value === 'auto' || this.maxDisplayedRows !== null) {
      const maxDisplayedRows = this.maxDisplayedRows !== null ? this.maxDisplayedRows : 10;
      const minRowCount = this.totalRows < maxDisplayedRows ? this.totalRows : maxDisplayedRows;
      const fullRowsCount: number = this.serverSideRowModel.limit ? this.serverSideRowModel.limit : minRowCount;
      const gridHeight: number =
        fullRowsCount * this.rowHeight + this.headerHeight + this.headerPagerHeight + this.scrollSize + 2;
      this._gridHeight = (this.userGridHeight === 0 && value !== 'auto' ? parseInt(value, 10) : gridHeight) + 'px';
    } else {
      this._gridHeight = value;
    }
    this.cd.markForCheck();
  }

  @HostBinding('style.width')
  get gridWidth(): string {
    return this._gridWidth;
  }

  @Input('gridWidth')
  set inputGridWidth(value: string) {
    this._gridWidth = value;
    this.cd.markForCheck();
  }

  /**
   * The rowData input is only available for client-side rowModel.
   * If you want to use server-side row model, you need to use the datasource.
   * @param rows
   */
  @Input()
  set rowData(rows: Array<any>) {
    if (this.isClientSideRowModel() && rows) {
      this._rowData = rows;
      this.clientSideRowModel.rowData = rows;
    } else {
      this.totalRows = 0;
      this._rowData = [];
    }
    this.cd.markForCheck();
  }

  get rowData(): Array<any> {
    return this._rowData;
  }

  /**
   * Gets the sorted rows.
   */
  get displayedRows(): any[] {
    return this._displayedRows;
  }

  /**
   * Rows that are displayed in the table.
   */
  set displayedRows(value: any[]) {
    this._displayedRows = value;
  }

  ngOnInit(): void {
    // Track all events that needs to be output.
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_CLICKED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_ROW_CLICKED, event);
        const ev: RowClickedEvent = event as RowClickedEvent;
        this.onRowClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED, event);
        const ev: RowDoubleClickedEvent = event as RowDoubleClickedEvent;
        this.onRowDoubleClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_CLICKED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_CELL_CLICKED, event);
        const ev: CellClickedEvent = event as CellClickedEvent;
        this.onCellClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_DOUBLE_CLICKED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_CELL_DOUBLE_CLICKED, event);
        const ev: CellDoubleClickedEvent = event as CellDoubleClickedEvent;
        this.onCellDoubleClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_CONTEXT_MENU).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_CELL_CONTEXT_MENU, event);
        const ev: CellContextMenuEvent = event as CellContextMenuEvent;
        this.onCellContextmenu.emit(ev);
      })
    );

    this.datagridOptionsWrapper.rowDataModel = this.rowDataModel;

    if (this.gridHeight !== 'auto') {
      this.isAutoGridHeight = false;
      this.userGridHeight = parseInt(this.gridHeight, 10);
    }

    this.setupColumns();
    this.calculateSizes();

    if (this.datasource) {
      if (this.isClientSideRowModel()) {
        this.rowDataModel = FuiRowModel.SERVER_SIDE;
      }

      if (this.isInfiniteServerSideRowModel()) {
        this.infiniteRowModel.init(this.datasource);
      }
      this.serverSideRowModel.init(this.datasource);

      this.subscriptions.push(
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_PAGER_SELECTED_PAGE).subscribe(event => {
          const ev: FuiPageChangeEvent = event as FuiPageChangeEvent;
          if (ev && ev.page) {
            this.isLoading = true;
            if (this.isInfiniteServerSideRowModel()) {
              this.infiniteRowModel.loadBlocks(ev.page.index);
              this.infiniteRefreshRows();
            }
            this.cd.markForCheck();
          }
        }),
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED).subscribe(event => {
          console.log(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED, event);
          const ev: ServerSideRowDataChanged = event as ServerSideRowDataChanged;
          this.renderGridRows(ev.resultObject);
        })
      );
    }

    this.subscriptions.push(
      this.gridPanel.isReady.subscribe(isReady => {
        this.gridPanelReady = isReady;
        const icons: { [name: string]: HTMLElement } = {};
        icons[FuiDatagridDragAndDropService.ICON_MOVE] = this.iconMove.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_HIDE] = this.iconDelete.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_LEFT] = this.iconLeft.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_RIGHT] = this.iconRight.nativeElement;
        this.dragAndDropService.initIcons(icons);

        // We wire the services to gridAPI and ColumnAPI.
        this.gridApi.init(this.columnService, this.gridPanel);
        this.columnApi.init(this.columnService, this.gridPanel);

        // By default we're trying to fit the columns width to grid size.
        setTimeout(() => {
          this.gridPanel.sizeColumnsToFit();
        });
      }),

      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED, event);
        const ev = event as DisplayedColumnsWidthChangedEvent;
        this.onColumnResized();
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_VISIBLE_CHANGED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_VISIBLE_CHANGED, event);
        const ev = event as ColumnEvent;
        this.onColumnChangeVisibility(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_DATA_CHANGED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_ROW_DATA_CHANGED, event);
        if (this.isClientSideRowModel()) {
          this.onGridRowsUpdated();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(event => {
        const ev: FuiSortColumnsEvent = event as FuiSortColumnsEvent;
        console.log(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED, event);
        if (this.isClientSideRowModel()) {
          this.onGridColumnsChanged();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_CHANGED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_SORT_CHANGED, event);
        if (this.isClientSideRowModel()) {
          this.onGridSort();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_FILTER_CHANGED).subscribe(event => {
        console.log(FuiDatagridEvents.EVENT_FILTER_CHANGED, event);
        if (this.isClientSideRowModel()) {
          this.onGridFilter();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_COLUMN_MOVED).subscribe(event => {
        const ev = event as ColumnMovedEvent;
        // When we switch the columns array, it trigger angular change which is causing a DOM manipulation.
        // Since both columns element are deleted then re-added at the good index, the CSS animation fail.
        // The only solution is to add a timeout between the columns switching (updating the left values)
        // and the actual columns array re-ordering.
        if (this.columnDraggingAnimationTimeout) {
          clearTimeout(this.columnDraggingAnimationTimeout);
        }
        this.columnDraggingAnimationTimeout = setTimeout(() => {
          console.log(FuiDatagridEvents.EVENT_COLUMN_MOVED, ev);

          if (this.isClientSideRowModel()) {
            this.updateColumns(ev.columns);
          } else if (this.isServerOrInfiniteRowModel()) {
            this.columnService.setDisplayedColumns(ev.columns);
          }

          const evt: ColumnEvent = {
            columns: ev.columns,
            api: ev.api,
            columnApi: ev.columnApi,
            column: ev.column,
            type: FuiDatagridEvents.EVENT_COLUMN_ORDER_CHANGED,
          };
          this.eventService.dispatchEvent(evt);
          this.cd.markForCheck();
        }, this.columnDraggingAnimationDelay);
      })
    );

    this.cd.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.datagridOptionsWrapper.gridOptions && (changes.rowData && !changes.rowData.isFirstChange())) {
      this.datagridOptionsWrapper.gridOptions.rowData = this.rowData;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this.subscriptions = undefined;
    this.eventService.flushListeners();
    if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.destroy();
    }
  }

  ngAfterViewInit(): void {
    const filterHeight: number = this.datagridFilters.height ? this.datagridFilters.height : 0;
    const pagerHeight: number = this.datagridPager.height ? this.datagridPager.height : 0;
    this.headerPagerHeight = filterHeight + pagerHeight;
    this.renderer.setStyle(this.rootWrapper.nativeElement, 'height', `calc(100% - ${this.headerPagerHeight}px)`);
    this.gridPanel.eHorizontalScrollBody = this.horizontalScrollBody.nativeElement;
    this.gridPanel.eBodyHorizontalScrollViewport = this.horizontalScrollViewport.nativeElement;
    this.gridPanel.eBodyHorizontalScrollContainer = this.horizontalScrollContainer.nativeElement;
  }

  pagerReset(reset: boolean) {
    if (reset) {
      // When we update the pager item per page value, we want to reset the displayed rows.
      if (this.isInfiniteServerSideRowModel()) {
        this.displayedRows = [];
      }
    }
  }

  columnTrackbyFn(index: number, column: Column): any {
    return column.colIndex;
  }

  rowTrackbyFn(index: number, instructor: any): any {
    if (this.trackByFn) {
      return this.trackByFn(index, instructor);
    }
    // We try to get identity from most common identifier if we can.
    if (instructor.id || instructor.guid || instructor.uuid) {
      return instructor.id || instructor.guid || instructor.uuid;
    } else {
      // Otherwise, we just return the whole object.
      return instructor;
    }
  }

  onGridRowsUpdated(): void {
    this.clientSideRowModel.doFilter();
  }

  onGridColumnsChanged(): void {
    this.clientSideRowModel.doSort();
  }

  onGridFilter(): void {
    this.clientSideRowModel.doSort();
  }

  onGridSort(): void {
    this.renderGridRows();
  }

  serverSideUpdateRows(forceReset: boolean = false): void {
    this.isLoading = true;
    this.serverSideRowModel.updateRows(forceReset, this.datagridPager.getCurrentPage().index).catch(error => {
      throw error;
    });
  }

  infiniteUpdateParams(): void {
    this.infiniteRowModel.loadBlocks(0);
    this.infiniteRefreshRows();
  }

  infiniteRefreshRows() {
    if (this.isInfiniteServerSideRowModel()) {
      if (this.infiniteRowModel) {
        this.displayedRows = [...this.infiniteRowModel.getDisplayedRows()];
      }
    }
  }

  renderGridRows(resultObject?: IDatagridResultObject): void {
    this.calculateSizes();
    if (this.isClientSideRowModel()) {
      this.displayedRows = this.clientSideRowModel.rowData;
      this.totalRows = this.clientSideRowModel.getTotalRows();
    } else if (this.isServerSideRowModel()) {
      this.isLoading = false;
      if (resultObject) {
        this.displayedRows = resultObject.data;
        this.totalRows = resultObject.total;
      }
    } else if (this.isInfiniteServerSideRowModel()) {
      this.isLoading = false;
      if (resultObject) {
        this.totalRows = resultObject.total;
      }
      this.infiniteRefreshRows();
    }
    this.inputGridHeight = this.isAutoGridHeight ? 'auto' : this.gridHeight;
    this.cd.markForCheck();
  }

  getVisibleColumns(): Column[] {
    return this.columnService.getVisibleColumns();
  }

  updateColumns(columns: Column[]) {
    this.columnService.setDisplayedColumns(columns);
    this.sortService.sortingColumns = columns;
  }

  onFakeHorizontalScroll(): void {
    this.gridPanel.onFakeHorizontalScroll();
  }

  onCenterViewportScroll(): void {
    this.gridPanel.onCenterViewportScroll();
  }

  onColumnsChange(columnEvent: ColumnEvent): void {
    if (columnEvent && columnEvent.columns) {
      this.updateColumns(columnEvent.columns);
    }
  }

  isClientSideRowModel() {
    return this.rowDataModel === FuiRowModel.CLIENT_SIDE;
  }

  isServerSideRowModel() {
    return this.rowDataModel === FuiRowModel.SERVER_SIDE;
  }

  isInfiniteServerSideRowModel() {
    return this.rowDataModel === FuiRowModel.INFINITE;
  }

  isServerOrInfiniteRowModel() {
    return this.isServerSideRowModel() || this.isInfiniteServerSideRowModel();
  }

  refreshGrid(resetFilters: boolean = true, resetSorting: boolean = false) {
    // We reset all filters by default
    if (resetFilters) {
      this.filterService.resetFilters();
    }
    // We do not reset the sorting columns by default, only if the dev decide to.
    if (resetSorting) {
      this.sortService.resetColumnsSortOrder();
      this.setupColumns();
    }

    this.datagridPager.resetPager();

    if (this.isClientSideRowModel()) {
      this.clientSideRowModel.rowData = this.rowData;
    } else if (this.isServerSideRowModel()) {
      this.serverSideRowModel.reset();
      this.serverSideRowModel.init(this.datasource);
    } else if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.reset();
      this.infiniteRowModel.init(this.datasource);
    }
  }

  getVisibleColumnsDef(): FuiColumnDefinitions[] {
    const colDefLength: number = this.columns.length;
    const columnsLength: number = this.columnService.getAllDisplayedColumns().length;
    if (colDefLength === columnsLength) {
      return this.columnService.getVisibleColumns().map(c => c.getColumnDefinition());
    } else {
      return this.columns;
    }
  }

  onColumnChangeVisibility(columnEvent: ColumnEvent): void {
    if (columnEvent && columnEvent.column) {
      this.columnService.updateColumnsPosition();
      this.calculateSizes();
    }
  }

  onColumnResized(): void {
    this.calculateSizes();
  }

  private calculateSizes(): void {
    this.totalWidth = this.columnService.getTotalColumnWidth();
    if (this.scrollbarHelper.width) {
      this.scrollSize = this.scrollbarHelper.width;
    }
    if (this.gridPanelReady && this.totalWidth) {
      this.renderer.setStyle(this.gridPanel.eCenterContainer, 'width', this.totalWidth + 'px');
    }
    this.cd.markForCheck();
  }

  private setupColumns(): void {
    this.datagridOptionsWrapper.gridOptions = {
      columnDefs: this.columnDefs,
      defaultColDef: this.defaultColDefs,
      headerHeight: this.headerHeight,
      rowHeight: this.rowHeight,
    };

    const defaultColDef: FuiColumnDefinitions = {
      resizable: true,
      lockPosition: false,
      lockVisible: false,
    };
    this.columns = this.columnDefs.map(colDef => {
      return { ...defaultColDef, ...this.defaultColDefs, ...colDef };
    });
  }
}
