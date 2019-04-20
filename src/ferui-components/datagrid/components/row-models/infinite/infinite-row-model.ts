import { EventEmitter, Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';

@Injectable()
export class FuiDatagridInfinteRowModel {
  isReady: EventEmitter<boolean> = new EventEmitter<boolean>();
  datasource: IServerSideDatasource;
  params: IServerSideGetRowsParams;
  infiniteCache: InfiniteCache;

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

    // The isReady event emitter doesn't need to wait for the first load of data to send the event.
    // So we don't need to wait for the promise to succeed or fail.
    this.isReady.emit(true);
  }

  destroy(): void {
    if (this.infiniteCache) {
      this.infiniteCache.destroy();
      this.infiniteCache = null;
    }
  }

  loadBlocks(blockNumber: number, forceUpdate: boolean = false): void {
    this.setParams();
    this.infiniteCache.setParams(this.getParams());
    this.infiniteCache.loadBlocks(blockNumber, this.limit, this.datasource, forceUpdate);
  }

  getDisplayedRows(): Observable<any[]> {
    return this.infiniteCache.getRows();
  }

  hasLoadingBlock(): boolean {
    if (this.infiniteCache) {
      return this.infiniteCache.hasLoadingBlock();
    }
    return false;
  }

  reset(): void {
    this.infiniteCache.clear();
    this.limit = null;
    this.totalRows = null;
  }

  refresh(limit: number, datasource?: IServerSideDatasource): void {
    this.reset();
    this.limit = limit;
    if (datasource) {
      this.datasource = datasource;
    }
    this.loadBlocks(0, true);
  }

  private getParams(): IServerSideGetRowsParams {
    return this.params;
  }

  private setParams(params?: IServerSideGetRowsParams): void {
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

      if (this.filterService.globalSearchFilter && this.filterService.globalSearchFilter.filter) {
        const aFilter = this.filterService.globalSearchFilter.filter;
        const activeFilterParams = {
          id: this.filterService.globalSearchFilter.index,
          visible: this.filterService.globalSearchFilter.filter.isFilterActive(),
          name: null,
          field: null,
          filterable: true,
          filterType: this.filterService.globalSearchFilter.filter.getFilterType(),
          filterValue: aFilter.getFilterValue(),
          filterOption: aFilter.getFilterOption(),
          filterParams: aFilter.getFilterParams(),
        };
        filterModel.push(activeFilterParams);
      }

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
          offset: null,
          limit: this.limit,
        },
      };
    }
  }
}
