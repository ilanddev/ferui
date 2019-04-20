import { Component, TemplateRef, ViewChild } from '@angular/core';
import {
  FuiDatagridBodyCellContext,
  FuiColumnDefinitions,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FilterType,
  IServerSideDatasource,
  IDateFilterParams,
  IServerSideGetRowsParams,
  IDatagridResultObject,
} from '@ferui/components';
import { DatagridService } from './datagrid.service';
import { RowDataApiService } from './server-side-api/datagrid-row.service';
import * as jsBeautify from 'js-beautify';

@Component({
  template: `
    <h2 class="mb-4">Documentation</h2>
    <hr />
    <h3 class="mb-4">Overview</h3>
    <h5>Client-side Row Model</h5>
    <p>
      The simplest approach is to send all row data to the browser in response to a single request at initialisation. For
      this use case the Client-side Row Model has been designed.
    </p>
    <p>
      The Client-side Row Model only renders the rows currently visible, so the upper limit of rows is governed by the
      browsers memory footprint and data transfer time, rather than any restrictions inside the grid.
    </p>
    <h5>Server-side Row Model</h5>
    <p>
      However many real world applications contain much larger data sets, often involving millions of records. In this case
      it simply isn't feasible to load all the data into the browser in one go. Instead, data will somehow need to be
      lazy-loaded as required and then purged to limit the memory footprint in the browser.
    </p>
    <p>
      This is precisely the problem the Server-side Row Model addresses, along with delegating server-side operations such
      as filtering and sorting.
    </p>

    <h3>Server-side Datasource</h3>
    <p>In order to use the Server side Row Model, you need to register a datasource with the grid.</p>
    <p>The interface for the datasource is as follows:</p>
    <pre><code [languages]="restrictTypescriptLang" [highlight]="serverSideDatasourceCode"></code></pre>

    <p>
      Each time the grid requires more rows, it will call the <code>getRows()</code> method. The method is passed a
      <code>params</code> object that contains a request object with details what row the grid is looking for. The
      interface for the params is as follows:
    </p>
    <pre><code [languages]="restrictTypescriptLang" [highlight]="serverSideDatasourceParamsCode"></code></pre>

    <p>
      The request gives details on what the grid is looking for. The request object can be serialised (eg via JSON) and
      sent to your server. The request has the following interface:
    </p>
    <pre><code [languages]="restrictTypescriptLang" [highlight]="serverSideDatasourceRequestCode"></code></pre>

    <p>The server should return an <code>IDatagridResultObject</code> object.</p>
    <pre><code [languages]="restrictTypescriptLang" [highlight]="datagridResultObjectCode"></code></pre>

    <h2 class="mb-2">Server-side datagrid example (with known total rows)</h2>
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
        [datasource]="dataSource"
        [isLoading]="isLoading"
        [defaultColDefs]="defaultColumnDefs"
        [columnDefs]="columnDefs"
      ></fui-datagrid>
    </div>
    <h2 class="mb-2">Server-side datagrid example (without known total rows)</h2>
    <p>
      If there is no way to know the total amount of rows the server would send you back, then the pager will adapt itself
      automatically. You don't need to do anything else.
    </p>
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
  `,
  providers: [DatagridService],
})
export class DatagridServerSideComponent {
  columnDefs: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  isLoading: boolean = true;
  dataSource: IServerSideDatasource;
  networkBandwith: number = 260;
  restrictTypescriptLang = ['typescript'];

  dataSource2: IServerSideDatasource;
  isLoading2: boolean = true;

  serverSideDatasourceCode: string = jsBeautify.js_beautify(`interface IServerSideDatasource {
    // The context object to use within the getRows function.
    context?: any;
  
    // grid calls this to get rows
    getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject>;
  }`);

  serverSideDatasourceParamsCode: string = jsBeautify.js_beautify(`interface IServerSideGetRowsParams {
    // details for the request, simple object, can be converted to JSON
    request: IServerSideGetRowsRequest;
  }`);

  serverSideDatasourceRequestCode: string = jsBeautify.js_beautify(`interface IServerSideGetRowsRequest {
    // Columns that are visible in the grid. 
    // Useful when you want to minimize requests sizes (less columns means less data transferred through network)
    columns: ColumnVO[];
  
    // When you have filters set in the grid, you want to let your API know what they are.
    filterModel: FilterModel[];
  
    // When you have sorting column(s) set in the grid, you want to let your API know what they are.
    sortModel: SortModel[];
  
    // Used for the pager. This allow you to get chunks of data per requests.
    offset: number;
  
    // Used for the pager. This allow you to tell your API how many rows you want to display.
    limit: number;
  }`);

  datagridResultObjectCode: string = jsBeautify.js_beautify(`
    export interface IDatagridResultObject {
    total?: number; // The total result is optional. If the server doesn't return this value the datagrid pager will adapt itself.
    data: any[]; // The current chunk of data coming from the server.
  }`);

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;

  constructor(private rowDataService: RowDataApiService, public datagridService: DatagridService) {}

  networkBandwithChange(value) {
    this.networkBandwith = value;
  }

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd',
    };

    this.columnDefs = [
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
            server.rowDataService.getRows(params).subscribe(
              (results: IDatagridResultObject) => {
                const delay: number = Number(server.networkBandwith);
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
            server.rowDataService.getHundredRows(params, false).subscribe(
              (results: IDatagridResultObject) => {
                const delay: number = Number(server.networkBandwith);
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
