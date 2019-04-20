import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatagridService } from '../datagrid.service';
import { RowDataApiService } from '../server-side-api/datagrid-row.service';
import {
  FuiColumnDefinitions,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IDatagridResultObject,
  IDateFilterParams,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FilterType,
  FuiDatagridBodyCellContext,
  FuiRowModel,
  FuiDatagrid,
} from '@ferui/components';

@Component({
  template: `
    <h1 class="mb-4">Infinite server-side datagrid</h1>

    <fui-tabs>
      <fui-tab [title]="'Examples'" [active]="true">
        <h3 class="mb-2">Datagrid with known total rows</h3>
        <div class="mb-4">
          <fui-demo-datagrid-option-menu
            [bandwidthSpeed]="networkBandwith"
            [datagridRowModel]="rowDataModel"
            [datagrid]="datagrid1"
            (bandwidthSpeedChange)="networkBandwithChange($event)"
          ></fui-demo-datagrid-option-menu>
        </div>
        <div class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid1
            [rowDataModel]="rowDataModel"
            [datasource]="dataSource"
            [isLoading]="isLoading"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs"
          ></fui-datagrid>
        </div>

        <h3 class="mb-2">Datagrid without known total rows</h3>
        <div class="mb-4">
          <fui-demo-datagrid-option-menu
            [bandwidthSpeed]="networkBandwith"
            [datagridRowModel]="rowDataModel"
            [datagrid]="datagrid2"
            (bandwidthSpeedChange)="networkBandwithChange($event)"
          ></fui-demo-datagrid-option-menu>
        </div>
        <div class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid2
            [rowDataModel]="rowDataModel"
            [datasource]="dataSource2"
            [isLoading]="isLoading2"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs"
          ></fui-datagrid>
        </div>

        <ng-template #avatarRenderer let-value="value">
          <img *ngIf="value" width="30" height="30" alt="" [src]="value" />
        </ng-template>

        <ng-template #browserFilter let-column="column" let-filterParams="column.filterParams">
          <fui-datagrid-browser-filter [column]="column" [filterParams]="filterParams"></fui-datagrid-browser-filter>
        </ng-template>

        <ng-template #userAgentRenderer let-value="value" let-row="row">
          <span [title]="row.user_agent" [innerHTML]="datagridService.getIconFor(value) | safeHtml"> </span>
        </ng-template>

        <ng-template #idRenderer let-value="value">
          <span *ngIf="value" [title]="value">{{ value }}</span>
          <span *ngIf="!value">
            <clr-icon class="fui-datagrid-loading-icon fui-loader-animation" shape="fui-spinner"></clr-icon>
          </span>
        </ng-template>
      </fui-tab>
      <fui-tab [title]="'Documentation'">
        <h3 class="mb-4">Overview</h3>
        <p>The <b>Infinite server side</b> row model works exactly</p>
      </fui-tab>
    </fui-tabs>
  `,
  styles: [
    `
      .fui-datagrid-loading-icon {
        color: #87a1b5;
        width: 14px;
        height: 14px;
      }
    `,
  ],
  providers: [DatagridService],
})
export class DatagridInfiniteServerSideComponent implements OnInit {
  columnDefs: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  isLoading: boolean = true;
  dataSource: IServerSideDatasource;
  rowDataModel: FuiRowModel = FuiRowModel.INFINITE;

  dataSource2: IServerSideDatasource;
  isLoading2: boolean = true;

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('actionsRenderer') actionsRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('idRenderer') idRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;

  @ViewChild('datagrid1') datagrid1: FuiDatagrid;
  @ViewChild('datagrid2') datagrid2: FuiDatagrid;

  networkBandwith: number = 260;

  constructor(private rowDataService: RowDataApiService, public datagridService: DatagridService) {}

  networkBandwithChange(value) {
    this.networkBandwith = value;
  }

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd',
    };

    this.columnDefs = [
      { headerName: 'ID', field: 'id', cellRenderer: this.idRenderer, filter: FilterType.NUMBER },
      {
        headerName: 'Avatar',
        field: 'avatar',
        hide: true,
        filter: false,
        cellRenderer: this.avatarRenderer,
        sortable: false,
      },
      { headerName: 'Username', field: 'username', minWidth: 150, sortOrder: 1, sort: FuiDatagridSortDirections.ASC },
      {
        headerName: 'Creation date',
        field: 'creation_date',
        minWidth: 150,
        sortOrder: 0,
        sortType: FuiFieldTypes.DATE,
        sort: FuiDatagridSortDirections.DESC,
        filter: FilterType.DATE,
        filterParams: dateFilterParams,
      },
      { headerName: 'Gender', field: 'gender' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Age', field: 'age', filter: FilterType.NUMBER },
      { headerName: 'Eye color', field: 'eye_color' },
      { headerName: 'Company', field: 'company' },
      { headerName: 'Address', field: 'address', minWidth: 150 },
      { headerName: 'Country', field: 'country' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 150 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 150 },
      { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
      { headerName: 'Registered ?', field: 'is_registered', filter: FilterType.BOOLEAN },
      { headerName: 'Favourite animal', field: 'favourite_animal', minWidth: 150 },
      { headerName: 'Favorite movie', field: 'favorite_movie', minWidth: 200 },
      {
        headerName: 'Browser',
        field: 'browser',
        cellRenderer: this.userAgentRenderer,
        sortable: false,
        filter: FilterType.CUSTOM,
        filterFramework: this.browserFilter,
      },
    ];

    this.defaultColumnDefs = {
      sortable: true,
      filter: true,
    };

    this.dataSource = ServerSideDatasource(this);
    this.dataSource2 = ServerSideDatasource2(this);

    function ServerSideDatasource(server): IServerSideDatasource {
      return {
        getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject> {
          return new Promise((resolve, reject) => {
            server.rowDataService.getRows(params, 500).subscribe(
              (results: IDatagridResultObject) => {
                const delay: number = server.networkBandwith;
                setTimeout(() => {
                  server.isLoading = false;
                  resolve(results);
                }, delay);
              },
              error => {
                reject(error);
              }
            );
          });
        },
      };
    }

    function ServerSideDatasource2(server): IServerSideDatasource {
      return {
        getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject> {
          return new Promise((resolve, reject) => {
            server.rowDataService.getRows(params, 500, false).subscribe(
              (results: IDatagridResultObject) => {
                const delay: number = server.networkBandwith;
                setTimeout(() => {
                  server.isLoading2 = false;
                  resolve(results);
                }, delay);
              },
              error => {
                reject(error);
              }
            );
          });
        },
      };
    }
  }
}
