import { Injectable } from '@angular/core';
import { FuiDatagridFilterService } from '../../services/datagrid-filter.service';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridEvents, FuiFilterEvent, FuiSortEvent, RowDataChanged } from '../../events';
import { FuiDatagridApiService } from '../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../services/datagrid-column-api.service';

@Injectable()
export class FuiDatagridClientSideRowModel {
  private _rowData: any[] = [];
  private _originalRowData: any[] = [];

  constructor(
    private filterService: FuiDatagridFilterService,
    private sortService: FuiDatagridSortService,
    private columnService: FuiColumnService,
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService
  ) {}

  get originalRowData(): any[] {
    return this._originalRowData;
  }

  set originalRowData(value: any[]) {
    this._originalRowData = value;
  }

  get rowData(): any[] {
    return this._rowData;
  }

  set rowData(value: any[]) {
    if (!value || (value && value.length === 0)) {
      this.filterService.rowData = [];
      this._rowData = [];
    } else {
      this._rowData = value;
      this.filterService.rowData = value;
      if (this.originalRowData.length === 0) {
        this.originalRowData = value;
      }
    }
    const event: RowDataChanged = {
      type: FuiDatagridEvents.EVENT_ROW_DATA_CHANGED,
      rowData: this._rowData,
      api: this.gridApi,
      columnApi: this.columnApi
    };
    this.eventService.dispatchEvent(event);
    this.doFilter();
  }

  doFilter(): void {
    this.filterService.filter();
    this._rowData = this.filterService.filteredData;
    this.originalRowData = this._rowData;
    const event: FuiFilterEvent = {
      api: null,
      columnApi: this.columnApi,
      rowData: this._rowData,
      type: FuiDatagridEvents.EVENT_FILTER_CHANGED
    };
    this.eventService.dispatchEvent(event);
  }

  getTotalRows() {
    return this.rowData.length;
  }

  doSort(): void {
    if (!this.sortService.hasSortingColumns()) {
      this._rowData = this.originalRowData;
      this.sortService.rows = this.originalRowData;
    } else {
      this.sortService.rows = this.filterService.filteredData;
      this._rowData = this.sortService.sortedRows;
    }
    const event: FuiSortEvent = {
      api: this.gridApi,
      columnApi: this.columnApi,
      sortedRows: this._rowData,
      type: FuiDatagridEvents.EVENT_SORT_CHANGED
    };
    this.eventService.dispatchEvent(event);
  }
}
