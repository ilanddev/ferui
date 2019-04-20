import { Column } from '../components/entities/column';
import { sortRows } from '../utils/sort';
import { Injectable } from '@angular/core';
import { FuiDatagridSortDirections } from '../types/sort-directions.enum';
import { FuiDatagridEventService } from './event.service';
import { FuiDatagridEvents, FuiSortColumnsEvent, FuiSortEvent } from '../events';
import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';

@Injectable()
export class FuiDatagridSortService {
  private _sortingColumns: Array<Column> = [];
  private _initialSortingColumns: Column[] = [];
  private _sortingColumnInitialized: boolean = false;
  private _rows: Array<any>[];
  private _sortedRows: Array<any> = [];

  constructor(
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService
  ) {}

  get sortingColumns(): Array<Column> {
    return this._sortingColumns;
  }

  set sortingColumns(columns: Array<Column>) {
    // We first filter columns that need to be sort to.
    const sortedColumns = columns.filter(col => {
      return col.getSort() !== FuiDatagridSortDirections.NONE;
    });
    // If we didn't set any sorting columns, we just clean the sortingColumns.
    if (!sortedColumns) {
      this._sortingColumns = [];
    } else {
      this._sortingColumns = sortedColumns;
    }
    const event: FuiSortColumnsEvent = {
      api: this.gridApi,
      columnApi: this.columnApi,
      sortedColumns: this._sortingColumns,
      type: FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED,
    };
    this.eventService.dispatchEvent(event);
    if (!this._sortingColumnInitialized) {
      this._initialSortingColumns = [...this._sortingColumns];
      this._sortingColumnInitialized = true;
    }
  }

  addSortingColumn(column: Column): void {
    // Only store columns that have a direction set.
    if (column.getSort() === FuiDatagridSortDirections.NONE) {
      return;
    }
    const columnIndex: number =
      this.sortingColumns.length > 0
        ? this.sortingColumns.findIndex(col => {
            return col.getColId() === column.getColId();
          })
        : -1;
    if (columnIndex >= 0) {
      this.sortingColumns.splice(columnIndex, 1, column);
    } else {
      this.sortingColumns.push(column);
    }
  }

  get sortedRows(): Array<any> {
    return this._sortedRows;
  }

  set sortedRows(value: Array<any>) {
    this._sortedRows = value;
  }

  get rows(): Array<any> {
    return this._rows;
  }

  set rows(value: Array<any>) {
    this._rows = [...value];
    this.sortedRows = this.sortRows();
  }

  sortRows(): Array<any> {
    if (!this.rows) {
      return [];
    }
    if (!this.hasSortingColumns()) {
      return [...this.rows];
    }
    return sortRows(this.rows, this.sortingColumns);
  }

  updateColumn(column: Column): void {
    const colIndex: number = this.sortingColumns.findIndex(col => {
      return col.getColId() === column.getColId();
    });
    // Here we need to reassign the value to this.sortingColumns each time to trigger the emitChange event from the setter.
    if (column.getSort() === FuiDatagridSortDirections.NONE && colIndex > -1) {
      const columns = [...this.sortingColumns];
      columns.splice(colIndex, 1);
      this.sortingColumns = columns;
    } else if (colIndex === -1) {
      this.sortingColumns = [...this.sortingColumns, column];
    } else {
      const columns = [...this.sortingColumns];
      columns[colIndex] = column;
      this.sortingColumns = columns;
    }
  }

  resetColumnsSortOrder(): void {
    this.sortingColumns = this._initialSortingColumns;
  }

  hasSortingColumns(): boolean {
    return this.sortingColumns.length > 0;
  }

  sortList(): Array<FuiDatagridSortDirections> {
    return [FuiDatagridSortDirections.ASC, FuiDatagridSortDirections.DESC, FuiDatagridSortDirections.NONE];
  }

  getNextSortOrder(): number {
    return this.sortingColumns.length;
  }

  getSortOrderByIndex(index: number): FuiDatagridSortDirections {
    return this.sortList()[index];
  }

  setSortForOtherColumnThan(column: Column, sort: FuiDatagridSortDirections): void {
    this._sortingColumns.forEach(col => {
      if (col.getColId() !== column.getColId()) {
        col.setSort(sort);
      }
    });
  }

  isMultiSort(): boolean {
    return this.sortingColumns.length > 1;
  }
}
