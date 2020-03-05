import { Injectable } from '@angular/core';
import { FuiGridOptions } from '../types/grid-options';
import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';
import { DatagridUtils } from '../utils/datagrid-utils';
import { FuiRowModel } from '../types/row-model.enum';
import { ExportParams } from './exporter/export-params';
import { Column } from '../components/entities/column';

@Injectable()
export class FuiDatagridOptionsWrapperService {
  public static MIN_COLUMN_WIDTH = 100; // In pixels

  rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  infiniteMaxSurroundingBlocksInCache: number = 4; // By default, we allow only 5 pages to be cached at the same time.
  infiniteInitialBlocksCount: number = 3; // By default, on first load, we load 3 blocks (pages).

  private defaultGridOption: FuiGridOptions = {
    headerHeight: 50,
    rowHeight: 50,
    minColWidth: FuiDatagridOptionsWrapperService.MIN_COLUMN_WIDTH,
    infiniteMaxSurroundingBlocksInCache: this.infiniteMaxSurroundingBlocksInCache,
    infiniteInitialBlocksCount: this.infiniteInitialBlocksCount
  };

  private _gridOptions: FuiGridOptions;

  constructor(private _gridApi: FuiDatagridApiService, private _columnApi: FuiDatagridColumnApiService) {}

  get gridOptions(): FuiGridOptions {
    return this._gridOptions;
  }

  set gridOptions(gridOptions: FuiGridOptions) {
    this._gridOptions = { ...this.defaultGridOption, ...gridOptions };
  }

  get gridApi(): FuiDatagridApiService {
    return this._gridApi;
  }

  get columnApi(): FuiDatagridColumnApiService {
    return this._columnApi;
  }

  getAutoSizePadding(): number {
    return this._gridOptions.autoSizePadding && this._gridOptions.autoSizePadding > 0 ? this._gridOptions.autoSizePadding : 40;
  }

  getMinColWidth(): number {
    if (this.gridOptions.minColWidth && this.gridOptions.minColWidth !== FuiDatagridOptionsWrapperService.MIN_COLUMN_WIDTH) {
      return this.gridOptions.minColWidth;
    }

    return FuiDatagridOptionsWrapperService.MIN_COLUMN_WIDTH;
  }

  getMaxColWidth(): number {
    if (this.gridOptions.maxColWidth && this.gridOptions.maxColWidth > this.getMinColWidth()) {
      return this.gridOptions.maxColWidth;
    }

    return null;
  }

  getColWidth(): number {
    if (typeof this.gridOptions.colWidth !== 'number' || this.gridOptions.colWidth < this.getMinColWidth()) {
      return this.getMinColWidth();
    }

    return this.gridOptions.colWidth;
  }

  isSuppressTouch(): boolean {
    return this.gridOptions.suppressTouch === true;
  }

  getItemPerPage(): number {
    return DatagridUtils.isNumeric(this.gridOptions.itemsPerPage) ? this.gridOptions.itemsPerPage : 10;
  }

  isSuppressCsvExport(): boolean {
    return this.gridOptions.suppressExport === true;
  }

  /**
   * Get the default ExportParams for exporting the Datagrid to file.
   */
  getDefaultExportParams<T>(): ExportParams<T> {
    return {
      skipHeader: false,
      skipFooters: false,
      suppressQuotes: false,
      fileName: 'fui-datagrid-export'
    };
  }
}
