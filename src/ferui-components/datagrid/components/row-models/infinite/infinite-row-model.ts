import { Injectable } from '@angular/core';
import {
  FilterModel,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModel,
} from '../../../types/server-side-row-model';
import { FuiDatagridSortService } from '../../../services/datagrid-sort.service';
import { FuiDatagridFilterService } from '../../../services/datagrid-filter.service';
import { FuiColumnService } from '../../../services/rendering/column.service';
import { FuiDatagridEventService } from '../../../services/event.service';
import { FuiDatagridApiService } from '../../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../../services/datagrid-column-api.service';
import { FuiDatagridOptionsWrapperService } from '../../../services/datagrid-options-wrapper.service';
import { InfiniteCache } from './infinite-cache';

@Injectable()
export class FuiDatagridInfinteRowModel {
  datasource: IServerSideDatasource;
  params: IServerSideGetRowsParams;
  infiniteCache: InfiniteCache;

  offset: number;
  limit: number;
  infiniteMaxSurroundingBlocksInCache: number;
  infiniteInitialBlocksCount: number;
  totalRows: number | null = null;

  constructor(
    private sortService: FuiDatagridSortService,
    private filterService: FuiDatagridFilterService,
    private columnService: FuiColumnService,
    private eventService: FuiDatagridEventService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private optionsWrapper: FuiDatagridOptionsWrapperService
  ) {}

  init(datasource: IServerSideDatasource): void {
    this.infiniteMaxSurroundingBlocksInCache = this.optionsWrapper.infiniteMaxSurroundingBlocksInCache;
    this.infiniteInitialBlocksCount = this.optionsWrapper.infiniteInitialBlocksCount;
    this.datasource = datasource;
    this.setParams();
    this.infiniteCache = new InfiniteCache(
      this.infiniteMaxSurroundingBlocksInCache,
      this.infiniteInitialBlocksCount,
      this.eventService
    );
    this.infiniteCache.init(this.limit, this.datasource, this.getParams());
  }

  destroy() {
    if (this.infiniteCache) {
      this.infiniteCache.destroy();
    }
  }

  loadBlocks(blockNumber: number) {
    this.setParams();
    this.infiniteCache.loadBlocks(blockNumber, this.limit, this.datasource);
  }

  getDisplayedRows(): any[] {
    return this.infiniteCache.getRows();
  }

  reset() {
    this.offset = null;
    this.limit = null;
    this.totalRows = null;
  }

  private getParams(): IServerSideGetRowsParams {
    return this.params;
  }

  private setParams(params?: IServerSideGetRowsParams): void {
    if (this.offset === undefined || this.offset === null) {
      this.offset = 0;
    }
    if (this.limit === undefined || this.limit === null) {
      this.limit = this.optionsWrapper.getItemPerPage();
    }
    if (params) {
      this.params = params;
    } else {
      const sortModel: SortModel[] =
        this.sortService.sortingColumns.length >= 0
          ? this.sortService.sortingColumns.map(column => column.getSortModel())
          : null;

      const filterModel: FilterModel[] =
        this.filterService.activeFilters.length >= 0
          ? this.filterService.activeFilters.map(aFilter => {
              const activeFilterParams = {
                filterValue: aFilter.filter.getFilterValue(),
                filterOption: aFilter.filter.getFilterOption(),
                filterParams: aFilter.filter.getFilterParams(),
              };
              return { ...aFilter.filter.getColumn().getFilterModel(), ...activeFilterParams };
            })
          : null;

      this.params = {
        request: {
          columns: this.columnService.getAllDisplayedColumns().map(column => {
            return {
              id: column.getColId(),
              displayName: column.name,
              field: column.getColId(),
            };
          }),
          filterModel: filterModel,
          sortModel: sortModel,
          offset: this.offset,
          limit: this.limit,
        },
      };
    }
  }
}
