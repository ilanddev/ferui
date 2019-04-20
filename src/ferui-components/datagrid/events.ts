import { Column } from './components/entities/column';
import { FuiDatagridApiService } from './services/datagrid-api.service';
import { FuiDatagridColumnApiService } from './services/datagrid-column-api.service';
import { DragItem, DragSource, HDirection, VDirection } from './types/drag-and-drop';
import { FuiPagerPage } from './types/pager';
import { IDatagridResultObject } from './types/server-side-row-model';

export interface DatagridEvent {
  type: string;
}

export interface FuiDatagridEvent extends DatagridEvent {
  api: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
}

export interface ColumnEvent extends FuiDatagridEvent {
  column: Column | null;
  columns: Column[] | null;
}

export interface FuiSortEvent extends FuiDatagridEvent {
  sortedRows: any[];
}

export interface FuiSortColumnsEvent extends FuiDatagridEvent {
  sortedColumns: any[];
}

export interface FuiPageChangeEvent extends FuiDatagridEvent {
  page: FuiPagerPage;
}

export interface BodyScrollEvent extends FuiDatagridEvent {
  direction: string;
  left: number;
  top: number;
}

export interface ColumnResizedEvent extends ColumnEvent {
  finished: boolean;
}

export interface ColumnMovedEvent extends ColumnEvent {
  toIndex: number | undefined;
}

export interface ColumnVisibleEvent extends ColumnEvent {
  visible: boolean | undefined;
}

export interface DraggingEvent {
  event: MouseEvent;
  x: number;
  y: number;
  vDirection: VDirection;
  hDirection: HDirection;
  dragSource: DragSource;
  dragItem: DragItem;
  fromNudge: boolean;
}

export interface DragEvent extends FuiDatagridEvent {}

export interface RowDataChanged extends FuiDatagridEvent {
  rowData: any[];
  totalRows?: number;
}

export interface ServerSideRowDataChanged extends FuiDatagridEvent {
  resultObject: IDatagridResultObject;
  pageIndex?: number;
}

export interface FuiFilterEvent extends FuiDatagridEvent {
  filteredRows: any[];
  totalRows?: number;
}

export class FuiDatagridEvents {
  /** A column drag has started, either resizing a column or moving a column. */
  public static EVENT_DRAG_STARTED = 'dragStarted';
  /** A column drag has stopped */
  public static EVENT_DRAG_STOPPED = 'dragStopped';
  // + renderedHeaderCell - for making header cell transparent when moving
  public static EVENT_MOVING_CHANGED = 'movingChanged';
  // + renderedCell - changing left position
  public static EVENT_LEFT_CHANGED = 'leftChanged';
  // + renderedCell - changing width
  public static EVENT_WIDTH_CHANGED = 'widthChanged';
  // + renderedColumn - for changing visibility icon
  public static EVENT_VISIBLE_CHANGED = 'visibleChanged';
  /** A column was moved */
  public static EVENT_COLUMN_MOVED = 'columnMoved';
  /** One or more columns was shown / hidden */
  public static EVENT_COLUMN_VISIBLE = 'columnVisible';
  public static EVENT_COLUMN_ORDER_CHANGED = 'columnOrderChanged';
  // + every time the filter changes, used in the floating filters
  public static EVENT_FILTER_CHANGED = 'filterChanged';
  // + renderedHeaderCell - marks the header with filter icon
  public static EVENT_FILTER_ACTIVE_CHANGED = 'filterActiveChanged';
  // + renderedHeaderCell - marks the header with sort icon
  public static EVENT_SORT_CHANGED = 'sortChanged';
  public static EVENT_SORT_COLUMN_CHANGED = 'sortColumnChanged';

  // + toolpanel, for gui updates
  public static EVENT_VALUE_CHANGED = 'columnValueChanged';
  // When the row data is updated, we trigger this event.
  public static EVENT_ROW_DATA_CHANGED = 'rowDataChanged';

  public static EVENT_SERVER_ROW_DATA_CHANGED = 'serverRowDataChanged';
  /** Main body of grid has scrolled, either horizontally or vertically */
  public static EVENT_BODY_SCROLL = 'bodyScroll';

  public static EVENT_PAGER_SELECTED_PAGE = 'pagerSelectedPage';
}
