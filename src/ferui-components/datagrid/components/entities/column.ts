import { FuiColumnDefinitions } from '../../types/column-definitions';
import { FuiDatagridApiService } from '../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../services/datagrid-column-api.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { ColumnUtilsService } from '../../utils/column-utils.service';
import { Injectable, TemplateRef } from '@angular/core';
import { FuiDatagridComparator } from '../../types/comparator';
import { FuiDatagridSortDirections } from '../../types/sort-directions.enum';
import { orderByComparator } from '../../utils/sort';
import { FuiFieldTypes } from '../../types/field-types.enum';
import { ColumnEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridEventService } from '../../services/event.service';
import { IFilterParams } from '../filters/interfaces/filter';
import { FilterType } from '../filters/interfaces/filter.enum';
import { FuiDatagridBaseFilter } from '../filters/filter/base-filter';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { FilterModel, SortModel } from '../../types/server-side-row-model';

export interface ColumnJSON {
  id: string;
  name: string;
  visible: boolean;
  field: string;
  sortable: boolean;
  sort: string;
  sortOrder: number;
  filterable: boolean;
  filter: string;
}

@Injectable()
export class Column {
  // Properties of class
  private colId: string;
  private columnDefinition: FuiColumnDefinitions;
  private actualWidth: number;
  private visible: boolean;
  private left: number;
  private oldLeft: number;
  private sort: FuiDatagridSortDirections;
  private moving: boolean = false;
  private lockPosition: boolean;
  private lockVisible: boolean;
  private minWidth: number;
  private maxWidth: number;

  // Properties for getters/setters
  private _sortOrder: number;
  private _sortable: boolean;
  private _sortComparator: FuiDatagridComparator;
  private _sortType: FuiFieldTypes = FuiFieldTypes.STRING;
  private _colIndex: number;
  private _nativeElement: HTMLElement;
  private _name: string = '';
  private _field: string;
  private _filter: FilterType;
  private _filterParams: IFilterParams;
  private _filterActive: boolean = false;
  private _filterFramework: TemplateRef<FuiDatagridBaseFilter<IFilterParams>>;

  constructor(
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private gridOptionsWrapper: FuiDatagridOptionsWrapperService,
    private columnUtils: ColumnUtilsService,
    private eventService: FuiDatagridEventService,
    private columnService: FuiColumnService,
    private sortService: FuiDatagridSortService
  ) {}

  get field(): string {
    return this._field;
  }

  set field(value: string) {
    this._field = value;
  }

  get filterFramework(): TemplateRef<FuiDatagridBaseFilter<IFilterParams>> {
    return this._filterFramework;
  }

  set filterFramework(value: TemplateRef<FuiDatagridBaseFilter<IFilterParams>>) {
    this._filterFramework = value;
  }

  get filterParams(): IFilterParams {
    return this._filterParams;
  }

  set filterParams(value: IFilterParams) {
    this._filterParams = value;
  }

  get filterActive(): boolean {
    return this._filterActive;
  }

  set filterActive(value: boolean) {
    this._filterActive = value;
  }

  get filter(): FilterType {
    return this._filter;
  }

  set filter(value: FilterType) {
    this._filter = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get sortComparator(): FuiDatagridComparator {
    return this._sortComparator;
  }

  set sortComparator(value: FuiDatagridComparator) {
    this._sortComparator = value;
  }

  get sortable(): boolean {
    return this._sortable;
  }

  set sortable(value: boolean) {
    this._sortable = value;
  }

  get sortOrder(): number {
    return this._sortOrder;
  }

  set sortOrder(value: number) {
    this._sortOrder = value;
  }

  get sortType(): FuiFieldTypes {
    return this._sortType;
  }

  set sortType(value: FuiFieldTypes) {
    this._sortType = value;
  }

  get colIndex(): number {
    return this._colIndex;
  }

  set colIndex(value: number) {
    this._colIndex = value;
  }

  get nativeElement(): HTMLElement {
    return this._nativeElement;
  }

  set nativeElement(value: HTMLElement) {
    this._nativeElement = value;
  }

  initialise(colDef: FuiColumnDefinitions, colId: string): void {
    this.columnDefinition = colDef;
    this.name = colDef.headerName;
    this.field = colDef.field;
    this.visible = !(colDef.hide === true);
    this.colId = colId;
    this.lockPosition = colDef.lockPosition === true;
    this.lockVisible = colDef.lockVisible === true;

    // sorting
    this.sortable = colDef.sortable;
    this.sort = colDef.sort || FuiDatagridSortDirections.NONE;
    this.sortComparator = colDef.sortComparator || orderByComparator;
    this.sortType = colDef.sortType;
    this.sortOrder = colDef.sortOrder || 0;

    // filtering
    this.filter = colDef.filter === true ? FilterType.STRING : typeof colDef.filter === 'string' ? colDef.filter : null;
    this.filterFramework = colDef.filterFramework ? colDef.filterFramework : null;
    this.filterParams = colDef.filterParams ? colDef.filterParams : null;

    const minColWidth = this.gridOptionsWrapper.getMinColWidth();
    const maxColWidth = this.gridOptionsWrapper.getMaxColWidth();
    if (this.columnDefinition.minWidth) {
      this.minWidth = this.columnDefinition.minWidth;
    } else {
      this.minWidth = minColWidth;
    }

    if (this.columnDefinition.maxWidth) {
      this.maxWidth = this.columnDefinition.maxWidth;
    } else {
      this.maxWidth = maxColWidth;
    }
    this.actualWidth = this.columnUtils.calculateColInitialWidth(this.columnDefinition);

    // Set the left value
    this.setLeft(this.columnService.getLastLeftValue());
    this.setOldLeft(this.columnService.getLastLeftValue());
    this.columnService.setLastLeftValue(this.actualWidth);
    this.columnService.addColumn(this);

    // Add the column to the sorting service in case the column has initial sorting.
    this.sortService.addSortingColumn(this);
  }

  isMultisort(): boolean {
    return this.sortService.isMultiSort();
  }

  isFilterAllowed(): boolean {
    // filter defined means it's a string, class or true.
    // if its false, null or undefined then it's false.
    return !!this.columnDefinition.filter || !!this.columnDefinition.filterFramework;
  }

  getGridApi(): FuiDatagridApiService {
    return this.gridApi;
  }

  getColumnApi(): FuiDatagridColumnApiService {
    return this.columnApi;
  }

  isLockPosition(): boolean {
    return this.lockPosition;
  }

  isLockVisible(): boolean {
    return this.lockVisible;
  }

  isVisible(): boolean {
    return this.visible;
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.eventService.dispatchEvent(this.createColumnEvent(FuiDatagridEvents.EVENT_VISIBLE_CHANGED));
  }

  setMoving(moving: boolean): void {
    this.moving = moving;
    this.eventService.dispatchEvent(this.createColumnEvent(FuiDatagridEvents.EVENT_MOVING_CHANGED));
  }

  getColumnDefinition(): FuiColumnDefinitions {
    return this.columnDefinition;
  }

  getColId(): string {
    return this.colId;
  }

  getId(): string {
    return this.getColId();
  }

  getRendererTemplate(): TemplateRef<any> {
    return this.columnDefinition.cellRenderer;
  }

  getMinWidth(): number {
    return this.minWidth;
  }

  getMaxWidth(): number {
    return this.maxWidth;
  }

  getActualWidth(): number {
    return this.actualWidth;
  }

  setActualWidth(actualWidth: number): void {
    if (this.actualWidth !== actualWidth) {
      this.actualWidth = actualWidth;
      this.eventService.dispatchEvent(this.createColumnEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED));
    }
  }

  getLeft(): number {
    return this.left;
  }

  getOldLeft(): number {
    return this.oldLeft;
  }

  getRight(): number {
    return this.left + this.actualWidth;
  }

  isMoving(): boolean {
    return this.moving;
  }

  getSort(): FuiDatagridSortDirections {
    return this.sort;
  }

  setSort(value: FuiDatagridSortDirections): void {
    if (value) {
      this.sort = value;
    }
  }

  isSorted(): boolean {
    return this.getSort() !== FuiDatagridSortDirections.NONE;
  }

  isResizable(): boolean {
    return this.columnDefinition.resizable === true;
  }

  isGreaterThanMax(width: number): boolean {
    if (this.maxWidth) {
      return width > this.maxWidth;
    }
    return false;
  }

  isLessThanMin(width: number): boolean {
    if (this.minWidth) {
      return width < this.minWidth;
    }
    return false;
  }

  setMinimum(): void {
    this.setActualWidth(this.getMinWidth());
  }

  setToMaximum(): void {
    this.setActualWidth(this.getMaxWidth());
  }

  setOldLeft(left: number) {
    this.oldLeft = left;
  }

  setLeft(left: number | null) {
    if (this.left !== left) {
      this.left = left;
      this.eventService.dispatchEvent(this.createColumnEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED));
    }
  }

  toJson(): ColumnJSON {
    return {
      id: this.getColId(),
      visible: this.isVisible(),
      name: this.name,
      field: this.getColId(),
      sortable: this.sortable,
      sort: this.getSort(),
      sortOrder: this.sortOrder,
      filterable: this.isFilterAllowed(),
      filter: this.filter
    };
  }

  getSortModel(): SortModel {
    return {
      id: this.getColId(),
      visible: this.isVisible(),
      name: this.name,
      field: this.getColId(),
      sortable: this.sortable,
      sort: this.getSort(),
      sortOrder: this.sortOrder,
      sortType: this.sortType
    };
  }

  getFilterModel(): FilterModel {
    return {
      id: this.getColId(),
      visible: this.isVisible(),
      name: this.name,
      field: this.getColId(),
      filterable: this.isFilterAllowed(),
      filterType: this.filter,
      filterParams: this.filterParams,
      filterValue: null,
      filterOption: null
    };
  }

  getExtraSortPaddingSize(): number {
    // If the header has sorting, the badges add more size.
    let sortPadding: number = 0;
    if (this.getSort() !== FuiDatagridSortDirections.NONE) {
      sortPadding += 14;
      if (this.isMultisort()) {
        sortPadding += 18;
      }
    }
    return sortPadding;
  }

  private createColumnEvent(type: string): ColumnEvent {
    return {
      api: this.gridApi,
      columnApi: this.columnApi,
      type: type,
      column: this,
      columns: [this]
    };
  }
}
