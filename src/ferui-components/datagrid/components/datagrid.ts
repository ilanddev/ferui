import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  Self,
  TemplateRef,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import { RowRendererService } from '../services/rendering/row-renderer.service';
import { FuiColumnDefinitions } from '../types/column-definitions';
import { FuiDatagridApiService } from '../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../services/datagrid-column-api.service';
import { FuiDatagridOptionsWrapperService } from '../services/datagrid-options-wrapper.service';
import { FuiColumnService } from '../services/rendering/column.service';
import { Column } from './entities/column';
import { ColumnUtilsService } from '../utils/column-utils.service';
import { FuiDatagridSortService } from '../services/datagrid-sort.service';
import { Subscription } from 'rxjs';
import {
  CellClickedEvent,
  CellContextMenuEvent,
  CellDoubleClickedEvent,
  ColumnEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  FuiDatagridEvents,
  FuiPageChangeEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
  ServerSideRowDataChanged
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
import { DatagridStateEnum, DatagridStateService } from '../services/datagrid-state.service';
import { HilitorService } from '../../hilitor/hilitor';
import { FuiPagerPage } from '../types/pager';
import { FuiDatagridBodyRowContext } from '../types/body-row-context';
import { FuiActionMenuService } from '../services/action-menu/action-menu.service';
import { DatagridUtils } from '../utils/datagrid-utils';
import { GridSerializer } from '../services/exporter/grid-serializer';
import { CsvCreator } from '../services/exporter/csv-creator';
import { Downloader } from '../services/exporter/downloader';
import { BaseExportParams } from '../services/exporter/export-params';
import { RowModel } from './row-models/row-model';
import { VirtualScrollerDefaultOptions } from '../../virtual-scroller/types/virtual-scroller-interfaces';
import {
  VIRTUAL_SCROLLER_DEFAULT_OPTIONS,
  VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY
} from '../../virtual-scroller/virtual-scroller-factory';
import { DomObserver, ObserverInstance } from '../../utils/dom-observer/dom-observer';
import { ScrollbarHelper } from '../../utils/scrollbar-helper/scrollbar-helper.service';

export function VIRTUAL_SCROLLER_DATAGRID_OPTIONS_FACTORY(): VirtualScrollerDefaultOptions {
  const defaults: VirtualScrollerDefaultOptions = VIRTUAL_SCROLLER_DEFAULT_OPTIONS_FACTORY();
  defaults.pxErrorValue = 0;
  return defaults;
}

@Component({
  selector: 'fui-datagrid',
  template: `
    <fui-datagrid-filters
      [displayFilters]="withFilters"
      [displayColumnVisibility]="withColumnVisibility"
      [hidden]="!withHeader"
      (heightChange)="onFilterPagerHeightChange()"
    >
      <ng-content></ng-content>
    </fui-datagrid-filters>

    <div class="fui-datagrid-root-wrapper" [style.height]="rootWrapperHeight" #rootWrapper>
      <div class="fui-datagrid-root-body-wrapper">
        <div class="fui-datagrid-root-body" role="grid" unselectable="on">
          <fui-datagrid-header unselectable="on" [style.height.px]="rowHeight" [style.min-height.px]="rowHeight">
            <fui-datagrid-header-viewport>
              <fui-datagrid-header-container [style.width.px]="totalWidth + scrollSize">
                <fui-datagrid-header-row [style.width.px]="totalWidth + scrollSize">
                  <fui-datagrid-header-cell
                    unselectable="on"
                    *ngFor="let hColumn of columns; index as i; trackBy: columnTrackByFn"
                    [colIndex]="i"
                    (changeVisibility)="onColumnChangeVisibility($event)"
                    (changeWidth)="onColumnChangeWidth($event)"
                    (resize)="onColumnResize($event)"
                    [rowHeight]="rowHeight"
                    [columnDefinition]="hColumn"
                  ></fui-datagrid-header-cell>
                </fui-datagrid-header-row>
              </fui-datagrid-header-container>
            </fui-datagrid-header-viewport>
          </fui-datagrid-header>

          <fui-datagrid-body [isFixedheight]="fixedHeight" [id]="virtualBodyId" [headerHeight]="rowHeight" unselectable="on">
            <fui-virtual-scroller
              #scroll
              class="fui-datagrid-body-viewport"
              [hideXScrollbar]="true"
              [bufferAmount]="virtualScrollBufferAmount"
              (verticalScroll)="onVerticalScroll($event)"
              (horizontalScroll)="onCenterViewportScroll()"
              [items]="displayedRows"
              role="presentation"
              unselectable="on"
            >
              <fui-datagrid-action-menu
                *ngIf="actionMenuTemplate"
                [actionMenuTemplate]="actionMenuTemplate"
                [style.height.px]="rowHeight - 2"
                [maxDisplayedRows]="maxDisplayedRows"
                virtualScrollClipperContent
              ></fui-datagrid-action-menu>

              <fui-datagrid-body-row
                *ngFor="let row of scroll.viewPortItems; index as idx; trackBy: rowTrackByFn"
                [data]="row"
                [rowIndex]="idx + scroll.viewPortInfo.startIndex"
                [style.width.px]="totalWidth"
                [datagridId]="datagridId"
              >
                <fui-datagrid-body-cell
                  *ngFor="let column of getVisibleColumns(); trackBy: columnTrackByIndexFn"
                  unselectable="on"
                  [column]="column"
                  [rowIndex]="idx + scroll.viewPortInfo.startIndex"
                  [rowHeight]="rowHeight"
                  [rowData]="row"
                ></fui-datagrid-body-cell>
              </fui-datagrid-body-row>
            </fui-virtual-scroller>

            <div
              class="fui-datagrid-infinite-loader"
              *ngIf="isInfiniteLoading && isInfiniteServerSideRowModel()"
              [style.width]="'calc(100% - ' + scrollSize + 'px)'"
              [style.bottom.px]="0"
            ></div>
          </fui-datagrid-body>

          <div class="fui-datagrid-footer" role="presentation"></div>

          <div
            class="fui-datagrid-horizontal-scroll"
            #horizontalScrollBody
            [hidden]="!hasHorizontalScroll"
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
            <div
              class="fui-horizontal-right-spacer"
              [hidden]="!hasVerticallScroll"
              [style.width.px]="scrollSize"
              [style.min-width.px]="scrollSize"
              [style.max-width.px]="scrollSize"
            ></div>
          </div>
        </div>
      </div>
      <div class="fui-datagrid-pager-wrapper"></div>
    </div>
    <fui-datagrid-pager
      [withFooterPager]="withFooterPager"
      [withFooterItemPerPage]="withFooterItemPerPage"
      [hidden]="!withFooter"
      [rowDataModel]="rowDataModel"
      (pagerReset)="pagerReset($event)"
      (heightChange)="onFilterPagerHeightChange()"
      (pagerItemPerPage)="onPagerItemPerPageChange($event)"
      [itemPerPage]="maxDisplayedRows"
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
    '[class.fui-datagrid-has-vertical-scroll]': 'hasVerticallScroll',
    '[class.fui-datagrid-has-filter]': 'datagridFilters !== undefined',
    '[class.fui-datagrid-has-pager]': 'datagridPager !== undefined',

    '[class.fui-datagrid-without-header]': '!withHeader',
    '[class.fui-datagrid-without-footer]': '!withFooter',
    '[class.fui-datagrid-rounded-corners]': 'roundedCorners'
  },
  providers: [
    { provide: VIRTUAL_SCROLLER_DEFAULT_OPTIONS, useFactory: VIRTUAL_SCROLLER_DATAGRID_OPTIONS_FACTORY },
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
    RowModel,
    DatagridStateService,
    HilitorService,
    FuiActionMenuService,
    Downloader
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiDatagrid implements OnInit, OnDestroy, AfterViewInit {
  @Output() onColumnWidthChange: EventEmitter<ColumnEvent> = new EventEmitter<ColumnEvent>();
  @Output() onColumnResized: EventEmitter<ColumnResizedEvent> = new EventEmitter<ColumnResizedEvent>();
  @Output() onColumnVisibilityChanged: EventEmitter<ColumnVisibleEvent> = new EventEmitter<ColumnVisibleEvent>();
  @Output() onRowClicked: EventEmitter<RowClickedEvent> = new EventEmitter<RowClickedEvent>();
  @Output() onRowDoubleClicked: EventEmitter<RowDoubleClickedEvent> = new EventEmitter<RowDoubleClickedEvent>();
  @Output() onCellClicked: EventEmitter<CellClickedEvent> = new EventEmitter<CellClickedEvent>();
  @Output() onCellDoubleClicked: EventEmitter<CellDoubleClickedEvent> = new EventEmitter<CellDoubleClickedEvent>();
  @Output() onCellContextmenu: EventEmitter<CellContextMenuEvent> = new EventEmitter<CellContextMenuEvent>();

  @Input() withHeader: boolean = true;
  @Input() withFilters: boolean = true;
  @Input() withColumnVisibility = true;
  @Input() withFooter: boolean = true;
  @Input() withFooterItemPerPage: boolean = true;
  @Input() withFooterPager: boolean = true;
  @Input() fixedHeight: boolean = false;
  @Input() roundedCorners: boolean = true;

  @Input() exportParams: BaseExportParams;
  @Input() actionMenuTemplate: TemplateRef<FuiDatagridBodyRowContext>;
  @Input() columnDefs: FuiColumnDefinitions[] = [];
  @Input() defaultColDefs: FuiColumnDefinitions = {};
  @Input() headerHeight: number = 50; // In px.
  @Input() rowHeight: number = 50; // In px.
  @Input() trackByFn: TrackByFunction<any>;
  @Input('vsBufferAmount') virtualScrollBufferAmount: number = 10;

  rootWrapperHeight: string = '100%';
  columns: FuiColumnDefinitions[] = [];
  totalWidth: number;
  scrollSize: number = 0;
  virtualBodyId: string = DatagridUtils.generateUniqueId('fui-body');
  @ViewChild(FuiDatagridFilters) datagridFilters: FuiDatagridFilters;
  @ViewChild(FuiDatagridPager) datagridPager: FuiDatagridPager;

  @ViewChild('horizontalScrollBody') private horizontalScrollBody: ElementRef;
  @ViewChild('horizontalScrollViewport') private horizontalScrollViewport: ElementRef;
  @ViewChild('horizontalScrollContainer') private horizontalScrollContainer: ElementRef;
  @ViewChild('rootWrapper') private rootWrapper: ElementRef;
  @ViewChild('iconMove') private iconMove: ElementRef;
  @ViewChild('iconDelete') private iconDelete: ElementRef;
  @ViewChild('iconLeft') private iconLeft: ElementRef;
  @ViewChild('iconRight') private iconRight: ElementRef;
  @ViewChild('scroll') private viewport: FuiVirtualScrollerComponent;

  private _datagridId: string = DatagridUtils.generateUniqueId('fui-datagrid');
  private _rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  private _gridWidth: string = '100%';
  private _gridHeight: string = 'auto';
  private _displayedRows: any[] = [];
  private _originalRowData: any[];
  private _maxDisplayedRows: number = null;
  private _maxDisplayedRowsFirstLoad: boolean = true;
  private _totalRows: number = 0;
  private _isFirstLoad: boolean = true;
  private _datasource: IServerSideDatasource = null;
  private _isLoading: boolean = true;
  private _isEmptyData: boolean = false;
  private _isServerSideInitiallyLoaded: boolean = false;
  private gridPanelReady: boolean = false;
  private isAutoGridHeight: boolean = true;
  private userGridHeight: number = 0;
  private subscriptions: Subscription[] = [];
  private domObservers: ObserverInstance[] = [];
  private highlightSearchTermsDebounce = null;
  private selectedPage: FuiPagerPage;
  private resizeEventDebounce: NodeJS.Timer;
  private bodyViewportScrollTop: number = 0;
  private defaultFiltersHeight: number = 60;
  private defaultPagersHeight: number = 50;
  private _hasVerticalScroll: boolean = false;
  private _hasHorizontalScroll: boolean = false;

  constructor(
    @Self() private element: ElementRef,
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
    private infiniteRowModel: FuiDatagridInfinteRowModel,
    private rowModel: RowModel,
    private stateService: DatagridStateService,
    private hilitor: HilitorService,
    private actionMenuService: FuiActionMenuService,
    private exportDownloader: Downloader
  ) {
    // Each time we are updating the states, we need to run change detection.
    this.subscriptions.push(
      this.stateService.getCurrentStates().subscribe(() => {
        this._isLoading = this.stateService.hasState(DatagridStateEnum.LOADING);
        this._isEmptyData = this.stateService.hasState(DatagridStateEnum.EMPTY);
        this.inputGridHeight = 'refresh';
      })
    );

    // When we load the datagrid for the first time, we want to display the initial loading.
    this.stateService.setLoading();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set datasource(datasource: IServerSideDatasource) {
    this._datasource = datasource;
    // If the datagrid has been initialized, we then need to refresh the datagrid when changing the datasource.
    if (this.stateService.hasState(DatagridStateEnum.INITIALIZED)) {
      this.refreshGrid(true, true);
    }
  }

  get datasource(): IServerSideDatasource {
    return this._datasource;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set rowDataModel(value: FuiRowModel) {
    this._rowDataModel = value;
    this.datagridOptionsWrapper.rowDataModel = value;
    this.rowModel.rowModel = value;
    this.cd.markForCheck();
  }

  get rowDataModel(): FuiRowModel {
    return this._rowDataModel;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @Input()
  set maxDisplayedRows(value: number) {
    // Do nothing if the value is the same.
    if (value === this._maxDisplayedRows) {
      return;
    }
    this._maxDisplayedRows = value;

    if (this.isClientSideRowModel() && !this._maxDisplayedRowsFirstLoad) {
      this.refreshGrid();
    } else if (this.isServerSideRowModel() && this.serverSideRowModel) {
      this.serverSideRowModel.limit = value;
    } else if (this.isInfiniteServerSideRowModel() && this.infiniteRowModel) {
      this.infiniteRowModel.limit = value;
    }
    this.inputGridHeight = 'refresh';
    this._maxDisplayedRowsFirstLoad = false;
    this.cd.markForCheck();
  }

  get maxDisplayedRows(): number {
    return this._maxDisplayedRows;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @HostBinding('attr.id')
  get datagridId(): string {
    return this._datagridId;
  }

  @Input('id')
  set inputDatagridId(value: string) {
    this._datagridId = value;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @HostBinding('style.height')
  get gridHeight(): string {
    return this._gridHeight;
  }

  @Input('gridHeight')
  set inputGridHeight(value: string) {
    // Do nothing if the value is the same.
    if (value !== 'refresh' && value !== 'auto' && value === this._gridHeight) {
      return;
    }
    if (value === 'auto' || value === 'refresh') {
      // This value correspond to two rows of 50px. We will display the loading view.
      const initialLoadHeight: number = !this.stateService.hasState(DatagridStateEnum.REFRESHING) && this.isLoading ? 100 : 0;
      const emptyDataHeight: number = !this.isLoading && this.isEmptyData ? 100 : 0;
      const maxDisplayedRows = this.maxDisplayedRows !== null ? this.maxDisplayedRows : 10;
      const totalRows: number = this.totalRows ? this.totalRows : this.displayedRows.length;
      const scrollSize: number = this.hasHorizontalScroll ? this.scrollSize : 0;
      const serverSideRowModel: FuiDatagridServerSideRowModel = this.rowModel.getServerSideRowModel();

      let gridHeight: number;
      if (!this.fixedHeight) {
        const minRowCount = totalRows < maxDisplayedRows ? totalRows : maxDisplayedRows;
        const fullRowsCount: number =
          serverSideRowModel && serverSideRowModel.limit
            ? minRowCount < serverSideRowModel.limit
              ? minRowCount
              : serverSideRowModel.limit
            : minRowCount;

        gridHeight =
          fullRowsCount * this.rowHeight +
          this.headerHeight +
          emptyDataHeight +
          initialLoadHeight +
          this.getHeaderPagerHeight() +
          scrollSize +
          1;
      } else {
        gridHeight = maxDisplayedRows * this.rowHeight + this.headerHeight + this.getHeaderPagerHeight() + scrollSize + 1;
      }
      this._gridHeight = gridHeight + 'px';
    } else {
      this._gridHeight = value;
    }
    this.rootWrapperHeight = `calc(100% - ${this.getHeaderPagerHeight()}px)`;
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  @HostBinding('style.width')
  get gridWidth(): string {
    return this._gridWidth;
  }

  @Input('gridWidth')
  set inputGridWidth(value: string) {
    this._gridWidth = value;
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * The rowData input is only available for client-side rowModel.
   * If you want to use server-side row model, you need to use the datasource.
   * @param rows
   */
  @Input()
  set rowData(rows: Array<any>) {
    this.totalRows = this.isClientSideRowModel() && rows ? rows.length : 0;
    this.clientSideRowModel.rowData = rows ? rows : [];
    if (this.datagridOptionsWrapper && this.datagridOptionsWrapper.gridOptions) {
      this.datagridOptionsWrapper.gridOptions.rowDataLength = this.totalRows;
    }
    this.isEmptyData = this.totalRows === 0;

    if (!this.isFirstLoad() && rows !== undefined) {
      this.isLoading = false;
    }
    this.cd.markForCheck();
  }

  get rowData(): Array<any> {
    return this.clientSideRowModel.rowData;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get hasVerticallScroll(): boolean {
    return this._hasVerticalScroll;
  }

  set hasVerticallScroll(value: boolean) {
    this._hasVerticalScroll = value;
    this.cd.markForCheck();
  }

  get hasHorizontalScroll(): boolean {
    return this._hasHorizontalScroll;
  }

  set hasHorizontalScroll(value: boolean) {
    this._hasHorizontalScroll = value;
    this.cd.markForCheck();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get totalRows(): number {
    return this._totalRows;
  }

  set totalRows(value: number) {
    if (value === this._totalRows) {
      return;
    }
    this._totalRows = value;
    this.inputGridHeight = 'refresh';
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isLoading(): boolean {
    return this._isLoading;
  }

  set isLoading(value: boolean) {
    if (value === true) {
      this.stateService.setLoading();
    } else {
      this.stateService.setLoaded();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  get isInfiniteLoading(): boolean {
    if (this.isInfiniteServerSideRowModel() && this.infiniteRowModel) {
      return this.infiniteRowModel.hasLoadingBlock();
    }
    return false;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set isEmptyData(value: boolean) {
    if (value === true) {
      this.stateService.setEmpty();
    } else {
      this.stateService.setNotEmpty();
    }
  }

  get isEmptyData(): boolean {
    return this._isEmptyData;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getGridApi(): FuiDatagridApiService {
    return this.gridApi;
  }

  getColumnApi(): FuiDatagridColumnApiService {
    return this.columnApi;
  }

  ngOnInit(): void {
    if (this.maxDisplayedRows === null) {
      this.maxDisplayedRows = 10;
    }

    // Track all events that needs to be output.
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_CLICKED).subscribe(event => {
        const ev: RowClickedEvent = event as RowClickedEvent;
        this.onRowClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED).subscribe(event => {
        const ev: RowDoubleClickedEvent = event as RowDoubleClickedEvent;
        this.onRowDoubleClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_CLICKED).subscribe(event => {
        const ev: CellClickedEvent = event as CellClickedEvent;
        this.onCellClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_DOUBLE_CLICKED).subscribe(event => {
        const ev: CellDoubleClickedEvent = event as CellDoubleClickedEvent;
        this.onCellDoubleClicked.emit(ev);
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_CELL_CONTEXT_MENU).subscribe(event => {
        const ev: CellContextMenuEvent = event as CellContextMenuEvent;
        this.onCellContextmenu.emit(ev);
      })
    );

    // If the dev forgot to set the row-model but still add a datasource object,
    // we would assume he wanted to set a basic server-side row model.
    if (this.datasource && this.isClientSideRowModel()) {
      this.rowDataModel = FuiRowModel.SERVER_SIDE;
    } else {
      this.datagridOptionsWrapper.rowDataModel = this.rowDataModel;
    }

    if (this.gridHeight !== 'auto') {
      this.isAutoGridHeight = false;
      this.userGridHeight = parseInt(this.gridHeight, 10);
    }

    this.setupColumns();
    this.calculateSizes();

    this.subscriptions.push(
      this.gridPanel.isReady.subscribe(isReady => {
        this.gridPanelReady = isReady;
        this.stateService.setInitialized();
        const icons: { [name: string]: HTMLElement } = {};
        icons[FuiDatagridDragAndDropService.ICON_MOVE] = this.iconMove.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_HIDE] = this.iconDelete.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_LEFT] = this.iconLeft.nativeElement;
        icons[FuiDatagridDragAndDropService.ICON_RIGHT] = this.iconRight.nativeElement;
        this.dragAndDropService.initIcons(icons);

        // We wire the services to gridAPI and ColumnAPI.
        this.gridApi.init(this.columnService, this.gridPanel);
        this.columnApi.init(this.columnService, this.gridPanel);

        if (this.datasource) {
          if (this.isServerSideRowModel()) {
            this.serverSideRowModel.init(this.datasource);
          } else if (this.isInfiniteServerSideRowModel()) {
            if (!this.infiniteRowModel.initialized) {
              this.infiniteRowModel.init(this.datasource);
            }
            this.subscriptions.push(
              this.infiniteRowModel.getDisplayedRows().subscribe(displayedRows => {
                this.displayedRows = displayedRows;
                if (!this.isLoading && this.displayedRows.length === 0) {
                  this.isEmptyData = true;
                } else if (!this.isLoading && this.displayedRows.length > 0) {
                  this.isEmptyData = false;
                }
                this.cd.markForCheck();
              })
            );
          }
        }

        const headerViewport: Element = this.element.nativeElement.querySelector('.fui-datagrid-header-viewport');
        this.domObservers.push(
          DomObserver.observe(headerViewport, (entities, observer) => {
            entities.forEach(entity => {
              if (entity.isIntersecting) {
                // By default we're trying to fit the columns width to grid size.
                this.gridPanel.sizeColumnsToFit();
                // Setup column services
                this.updateColumnService();
                // This need to be executed only once.
                observer.unobserve(headerViewport);
              }
            });
          })
        );
      }),

      // Server-side only
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_PAGER_SELECTED_PAGE).subscribe(event => {
        const ev: FuiPageChangeEvent = event as FuiPageChangeEvent;
        if (ev && ev.page && (!this.selectedPage || (this.selectedPage && ev.page.index !== this.selectedPage.index))) {
          this.selectedPage = ev.page;
          if (this.isInfiniteServerSideRowModel()) {
            this.infiniteUpdateParams(ev.page.index);
            this.cd.markForCheck();
          } else if (this.isServerSideRowModel()) {
            if (this._isServerSideInitiallyLoaded) {
              this.stateService.setRefreshing();
            }
            this._isServerSideInitiallyLoaded = true;
            this.isLoading = true;
          }
        }
        this.highlightSearchTerms();
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED).subscribe(event => {
        const ev: ServerSideRowDataChanged = event as ServerSideRowDataChanged;
        this.renderGridRows(ev.resultObject);
      }),

      // All row-models
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED).subscribe(() => {
        this.calculateSizes();
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_ROW_DATA_CHANGED).subscribe(() => {
        if (this.isClientSideRowModel()) {
          this.onGridRowsUpdated();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(() => {
        if (this.isClientSideRowModel()) {
          this.onGridColumnsChanged();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams(0, true);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_CHANGED).subscribe(() => {
        if (this.isClientSideRowModel()) {
          this.onGridSort();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteUpdateParams(0, true);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_FILTER_CHANGED).subscribe(() => {
        if (this.isClientSideRowModel()) {
          this.onGridFilter();
        } else if (this.isServerSideRowModel()) {
          this.serverSideUpdateRows();
        } else if (this.isInfiniteServerSideRowModel()) {
          this.infiniteRowModel.reset();
          this.infiniteUpdateParams(0, true);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_COLUMN_MOVED).subscribe(() => {
        this.cd.markForCheck();
      })
    );
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    this.subscriptions = undefined;
    this.domObservers.forEach(observerInstance => DomObserver.unObserve(observerInstance));
    this.domObservers = undefined;
    this.eventService.flushListeners();
    if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.destroy();
    }
  }

  ngAfterViewInit(): void {
    this.gridPanel.eHorizontalScrollBody = this.horizontalScrollBody.nativeElement;
    this.gridPanel.eBodyHorizontalScrollViewport = this.horizontalScrollViewport.nativeElement;
    this.gridPanel.eBodyHorizontalScrollContainer = this.horizontalScrollContainer.nativeElement;
    this.gridPanel.eCenterViewportVsClipper = this.viewport.horizontalScrollClipperElementRef.nativeElement;
    this.gridPanel.eHeaderFilters = this.datagridFilters.elementRef.nativeElement;
    this.gridPanel.ePager = this.datagridPager.elementRef.nativeElement;

    // Setup Hilitor
    this.hilitor.setTargetNode(this.virtualBodyId);
    this.hilitor.setMatchType('open');

    // We wait that the viewport and its scrollable container intersect with the DOM.
    const domObserverTargets: Element[] = [
      this.viewport.element.nativeElement,
      this.viewport.horizontalScrollClipperWrapper.nativeElement,
      this.viewport.contentElementRef.nativeElement
    ];
    this.domObservers.push(
      DomObserver.observeMultiple(
        domObserverTargets,
        (entries, observer) => {
          let hasIntersect: boolean = true;
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              hasIntersect = false;
            }
          });
          if (hasIntersect) {
            if (this.isFirstLoad()) {
              // If content has been loaded and it's first load, we then run the autoSizeColumns function.
              this.inputGridHeight = 'refresh';
              this._isFirstLoad = false;
              this.autoSizeColumns();
              // We can kill the observers once loaded (no need to re-run this again)
              domObserverTargets.forEach(target => observer.unobserve(target));
            }
          }
        },
        () => {
          const contentWidth: number = this.viewport.contentElementRef.nativeElement.offsetWidth;
          const viewportWidth: number = this.viewport.element.nativeElement.offsetWidth;
          const viewportHeight: number = this.viewport.element.nativeElement.offsetHeight;
          const contentHeight: number = this.viewport.horizontalScrollClipperWrapper.nativeElement.offsetHeight;

          this.hasHorizontalScroll = contentWidth > viewportWidth;
          this.hasVerticallScroll = contentHeight > viewportHeight;
          this.inputGridHeight = 'refresh';
        }
      )
    );
  }

  /**
   * When we resize the window, we need to automatically adapt the datagrid to fill the new size.
   * After some tests, I've found out that 60ms was a good compromise between performance and UI.
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    if (this.resizeEventDebounce) {
      clearTimeout(this.resizeEventDebounce);
      this.resizeEventDebounce = undefined;
    }
    // We set 60ms delay performance-wise.
    this.resizeEventDebounce = setTimeout(() => {
      this.autoSizeColumns();
    }, 60);
  }

  pagerReset(reset: boolean) {
    if (reset) {
      // When we update the pager item per page value, we want to reset the displayed rows.
      if (this.isInfiniteServerSideRowModel()) {
        this.displayedRows = [];
      }
    }
  }

  columnTrackByFn(index: number, column: FuiColumnDefinitions): any {
    return column.field;
  }

  columnTrackByIndexFn(index: number, column: Column): any {
    return column.getColId();
  }

  rowTrackByFn(index: number, instructor: any): any {
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
    this.serverSideRowModel.updateRows(forceReset, this.datagridPager.getCurrentPageIndex()).catch(error => {
      throw error;
    });
  }

  infiniteUpdateParams(blockNumber: number = 0, forceUpdate: boolean = false): void {
    this.infiniteRowModel.loadBlocks(blockNumber, forceUpdate);
  }

  renderGridRows(resultObject?: IDatagridResultObject): void {
    this.calculateSizes();
    if (this.isClientSideRowModel()) {
      this.displayedRows = this.clientSideRowModel.rowData;
      this.totalRows = this.clientSideRowModel.getTotalRows();
      if (!this.isLoading && this.totalRows === 0) {
        this.isEmptyData = true;
      } else if (!this.isLoading && this.totalRows > 0) {
        this.isEmptyData = false;
      }
    } else if (this.isServerSideRowModel()) {
      if (resultObject) {
        this.displayedRows = resultObject.data;
        this.totalRows = resultObject.total;
        this.stateService.setRefreshed();
        this.isLoading = false;
        if (this.displayedRows.length === 0) {
          this.isEmptyData = true;
        } else if (this.displayedRows.length > 0) {
          this.isEmptyData = false;
        }
      }
    } else if (this.isInfiniteServerSideRowModel()) {
      if (resultObject) {
        this.totalRows = resultObject.total;
      }
    }
    this.cd.markForCheck();
    this.highlightSearchTerms();
  }

  getVisibleColumns(): Column[] {
    return this.columnService.getVisibleColumns();
  }

  updateColumnService() {
    this.sortService.sortingColumns = this.columnService.getAllDisplayedColumns();
  }

  onPagerItemPerPageChange(itemPerPage: number) {
    if (this.isServerSideRowModel()) {
      this.serverSideRowModel.reset();
      this.serverSideRowModel.limit = itemPerPage;
      this.serverSideRowModel
        .updateRows()
        .then(() => {
          // To calculate the height of the grid after loading more data through server-side row model,
          // we need to refresh the grid height to take the new loaded data into account
          this.inputGridHeight = 'refresh';
        })
        .catch(error => {
          throw error;
        });
    } else if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.refresh(itemPerPage);
    }
    this.maxDisplayedRows = itemPerPage;
  }

  onFakeHorizontalScroll(): void {
    this.gridPanel.onFakeHorizontalScroll();
  }

  onCenterViewportScroll(): void {
    this.gridPanel.onCenterViewportScroll();
  }

  onVerticalScroll(event: Event): void {
    this.gridPanel.onVerticalScroll();
    // The EventTarget coming from a scroll Event is an Element.
    // So we can just assume that the EventTarget is in fact an Element.
    const target: Element = (event.target || event.srcElement) as Element;
    if (target && target.scrollTop !== this.bodyViewportScrollTop) {
      this.bodyViewportScrollTop = target.scrollTop;
      // This part is only when we have an action menu set.
      // It will trigger the action menu close event when scrolling.
      if (this.actionMenuTemplate && this.actionMenuService) {
        if (this.actionMenuService.isActionMenuDropdownOpen) {
          this.actionMenuService.isActionMenuDropdownOpen = false;
        }
      }
    }
  }

  isClientSideRowModel() {
    return this.rowModel.isClientSideRowModel();
  }

  isServerSideRowModel() {
    // At initialisation, if the developer doesn't set any row model, by default it will be ClientSide.
    // But if he set a datasource, the default row model will be server side.
    return this.rowModel.isServerSideRowModel() || (this.rowModel.isClientSideRowModel() && this.datasource);
  }

  isInfiniteServerSideRowModel() {
    return this.rowModel.isInfiniteServerSideRowModel();
  }

  refreshGrid(resetFilters: boolean = false, resetSorting: boolean = false) {
    // Do nothing if we are refreshing the grid already.
    if (this.stateService.hasState(DatagridStateEnum.REFRESHING)) {
      return;
    }
    this.stateService.setRefreshing();
    this.isLoading = true;
    // We reset all filters by default
    if (resetFilters) {
      this.filterService.resetFilters();
      // We remove hilitor during reset
      this.hilitor.remove();
    }
    // We do not reset the sorting columns by default, only if the dev decide to.
    if (resetSorting) {
      this.setupColumns();
      this.sortService.resetColumnsSortOrder();
    }
    this.datagridPager.resetPager();

    if (this.isClientSideRowModel()) {
      // We store the original data in a new array.
      this._originalRowData = [...this.rowData];
      this.rowData = undefined;
      this.cd.markForCheck();
      setTimeout(() => {
        this.rowData = this._originalRowData;
        // Clear the memory immediately once we've reassign the data.
        this._originalRowData = undefined;
        this.cd.markForCheck();
        this.stateService.setRefreshed();
      }, 50);
    } else if (this.isServerSideRowModel()) {
      this.serverSideRowModel
        .refresh(this.maxDisplayedRows, this.datasource)
        .then(() => {
          this.stateService.setRefreshed();
        })
        .catch(() => {
          this.stateService.setRefreshed();
        });
    } else if (this.isInfiniteServerSideRowModel()) {
      this.infiniteRowModel.refresh(this.maxDisplayedRows, this.datasource);
    }
  }

  onColumnChangeVisibility(columnEvent: ColumnVisibleEvent): void {
    if (columnEvent && columnEvent.column) {
      this.autoSizeColumns();
      this.onColumnVisibilityChanged.emit(columnEvent);
    }
  }

  onColumnChangeWidth(columnEvent: ColumnEvent) {
    if (columnEvent && columnEvent.column) {
      this.calculateSizes();
      this.onColumnWidthChange.emit(columnEvent);
    }
  }

  onColumnResize(event: ColumnResizedEvent): void {
    this.calculateSizes();
    this.onColumnResized.emit(event);
  }

  onFilterPagerHeightChange() {
    this.rootWrapperHeight = `calc(100% - ${this.getHeaderPagerHeight()}px)`;
    this.cd.markForCheck();
  }

  exportGrid() {
    const serializer: GridSerializer<any> = new GridSerializer<any>(this.getVisibleColumns(), this.displayedRows);
    const csvCreator: CsvCreator = new CsvCreator(this.exportDownloader, serializer, this.datagridOptionsWrapper);
    csvCreator.export(this.exportParams);
  }

  private isGridLoadedOnce(): boolean {
    return this.stateService.hasState(DatagridStateEnum.LOADED) && this.stateService.hasState(DatagridStateEnum.INITIALIZED);
  }

  private isFirstLoad(): boolean {
    return this.isGridLoadedOnce() && this._isFirstLoad === true;
  }

  private autoSizeColumns() {
    this.columnService.autoSizeAllColumns(this.gridPanel.eBodyViewport);
    this.columnService.updateColumnsPosition();
    this.calculateSizes();
  }

  private highlightSearchTerms() {
    let searchTerms = '';
    if (this.filterService.globalSearchFilter && this.filterService.globalSearchFilter.filter) {
      searchTerms = this.filterService.globalSearchFilter.filter.getFilterValue();
    }

    if (this.highlightSearchTermsDebounce) {
      clearTimeout(this.highlightSearchTermsDebounce);
    }
    this.highlightSearchTermsDebounce = setTimeout(() => {
      if (searchTerms === '') {
        this.hilitor.remove();
      } else {
        this.hilitor.apply(searchTerms);
      }
    }, 50);
  }

  private calculateSizes(): void {
    this.totalWidth = this.columnService.getTotalColumnWidth();
    if (this.scrollbarHelper.getWidth()) {
      this.scrollSize = this.scrollbarHelper.getWidth();
    }
    this.gridPanel.setCenterContainerSize();
    this.cd.markForCheck();
  }

  /**
   * Return the sum of pager height and filters height if any.
   */
  private getHeaderPagerHeight(): number {
    const filterHeight: number =
      this.withHeader && this.datagridFilters && this.datagridFilters.getElementHeight()
        ? this.datagridFilters.getElementHeight()
        : !this.withHeader
        ? 0
        : this.defaultFiltersHeight;
    const pagerHeight: number =
      this.withFooter && !this.isLoading && this.datagridPager && this.datagridPager.getElementHeight()
        ? this.datagridPager.getElementHeight()
        : !this.withFooter
        ? 0
        : this.defaultPagersHeight;
    return filterHeight + pagerHeight;
  }

  private setupColumns(): void {
    this.datagridOptionsWrapper.gridOptions = {
      columnDefs: this.columnDefs,
      defaultColDef: this.defaultColDefs,
      headerHeight: this.headerHeight,
      rowHeight: this.rowHeight
    };

    const defaultColDef: FuiColumnDefinitions = {
      resizable: true,
      lockPosition: false,
      lockVisible: false
    };
    this.columns = this.columnDefs.map(colDef => {
      return { ...defaultColDef, ...this.defaultColDefs, ...colDef };
    });
  }
}
