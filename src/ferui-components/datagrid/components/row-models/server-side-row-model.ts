import { Injectable } from '@angular/core';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridFilterService } from '../../services/datagrid-filter.service';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../events';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridApiService } from '../../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../../services/datagrid-column-api.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import {
  FilterModel,
  IDatagridResultObject,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  SortModel,
} from '../../types/server-side-row-model';
import { FuiRowModel } from '../../types/row-model.enum';

@Injectable()
export class FuiDatagridServerSideRowModel {
  datasource: IServerSideDatasource;
  params: IServerSideGetRowsParams;

  offset: number;
  limit: number;
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
    this.datasource = datasource;
    this.setParams();
    this.updateRows().catch(error => {
      throw error;
    });
  }

  reset() {
    this.offset = null;
    this.limit = null;
    this.totalRows = null;
    this.setParams();
  }

  updateRows(forceReset: boolean = false, pageIndex: number = null): Promise<IDatagridResultObject> {
    if (this.datasource) {
      if (forceReset) {
        this.reset();
      } else {
        this.setParams();
      }
      const params: IServerSideGetRowsParams = this.getParams();

      if (this.optionsWrapper.rowDataModel === FuiRowModel.INFINITE) {
        params.request.limit = params.request.limit + this.optionsWrapper.infiniteServerSideBuffer;
      }
      return this.datasource.getRows
        .bind(this.datasource.context, params)()
        .then(resultObject => {
          if (resultObject.data.length === 0 && !resultObject.total) {
            return {
              total: null,
              data: null,
            };
          }
          this.totalRows = resultObject.total ? resultObject.total : null;
          const event: ServerSideRowDataChanged = {
            type: FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED,
            resultObject: resultObject,
            api: this.gridApi,
            columnApi: this.columnApi,
            pageIndex: pageIndex === null ? 0 : pageIndex,
          };
          this.eventService.dispatchEvent(event);
          return resultObject;
        })
        .catch(error => {
          return error;
        });
    }
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
