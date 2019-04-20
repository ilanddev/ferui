import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatagridService } from './datagrid.service';
import { RowDataApiService } from './server-side-api/datagrid-row.service';
import * as jsBeautify from 'js-beautify';
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
} from '@ferui/components';
import { FuiRowModel } from '../../../../../ferui-components/datagrid/types/row-model.enum';
import { FuiDatagrid } from '../../../../../ferui-components/datagrid/components/datagrid';

@Component({
  template: `
    <h2 class="mb-2">Server-side infinite-scroll datagrid example (with known total rows)</h2>
    <div class="mb-4">
      <div class="container-fluid">
        <div class="row">
          <fui-demo-datagrid-option-menu
            [bandwidthSpeed]="networkBandwith"
            (bandwidthSpeedChange)="networkBandwithChange($event)"
          ></fui-demo-datagrid-option-menu>
        </div>
      </div>
    </div>
    <div class="mb-4" style="width: 100%;">
      <fui-datagrid
        [rowDataModel]="rowDataModel"
        [datasource]="dataSource"
        [isLoading]="isLoading"
        [defaultColDefs]="defaultColumnDefs"
        [columnDefs]="columnDefs"
      ></fui-datagrid>
    </div>

    <h2 class="mb-2">Server-side infinite-scroll datagrid example (without known total rows)</h2>
    <div class="mb-4">
      <div class="container-fluid">
        <div class="row">
          <div class="col-auto pt-2">
            <fui-demo-datagrid-option-menu
              [bandwidthSpeed]="networkBandwith"
              (bandwidthSpeedChange)="networkBandwithChange($event)"
            ></fui-demo-datagrid-option-menu>
          </div>
          <div class="col-auto pt-3">
            <button class="btn btn-secondary" (click)="refreshGrid()">Refresh grid</button>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4" style="width: 100%;">
      <fui-datagrid
        #datagrid
        id=""
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
  restrictTypescriptLang = ['typescript'];
  rowDataModel: FuiRowModel = FuiRowModel.INFINITE;

  dataSource2: IServerSideDatasource;
  isLoading2: boolean = true;

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('actionsRenderer') actionsRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('idRenderer') idRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;
  @ViewChild('datagrid') datagrid: FuiDatagrid;

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
      { headerName: 'ID', field: 'id', cellRenderer: this.idRenderer },
      { headerName: 'Avatar', field: 'avatar', filter: false, cellRenderer: this.avatarRenderer, sortable: false },
      { headerName: 'Username', field: 'username', sortOrder: 1, sort: FuiDatagridSortDirections.ASC },
      {
        headerName: 'Creation date',
        field: 'creation_date',
        width: 150,
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
      { headerName: 'Address', field: 'address', width: 200 },
      { headerName: 'Country', field: 'country' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', width: 200 },
      { headerName: 'Ip-address', field: 'ip_address', width: 200 },
      { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
      { headerName: 'Registered ?', field: 'is_registered', filter: FilterType.BOOLEAN },
      { headerName: 'Favourite animal', field: 'favourite_animal', width: 150 },
      { headerName: 'Favorite movie', field: 'favorite_movie', width: 250 },
      {
        headerName: 'Browser',
        field: 'browser',
        width: 200,
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

  refreshGrid() {
    this.datagrid.refreshGrid();
  }
}
