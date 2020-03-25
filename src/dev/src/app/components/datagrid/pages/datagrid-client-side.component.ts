import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FilterType,
  FuiColumnDefinitions,
  FuiDatagrid,
  FuiDatagridBodyCellContext,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FuiRowModel,
  IDateFilterParams,
  CsvExportParams
} from '@ferui/components';
import { DatagridService } from '../datagrid.service';
import { IDatagridRowData } from '../server-side-api/datagrid-row.service';

// @ts-ignore
@Component({
  template: `
    <h1 class="mt-4 mb-4">Client-side datagrid</h1>

    <fui-tabs>
      <fui-tab [title]="'Examples'" [active]="true">
        <div class="mb-2">
          <fui-demo-datagrid-option-menu [datagridRowModel]="rowDataModel" [datagrid]="datagrid">
            <button class="btn btn-warning btn-sm" (click)="withHeader = !withHeader">
              {{ withHeader ? 'Hide header' : 'Display header' }}
            </button>
            <button class="btn btn-warning ml-2 mr-2 btn-sm" (click)="withFooter = !withFooter">
              {{ withFooter ? 'Hide footer' : 'Display footer' }}
            </button>
            <button
              *ngIf="withFooter"
              class="btn btn-warning ml-2 mr-2 btn-sm"
              (click)="withFooterItemPerPage = !withFooterItemPerPage"
            >
              {{ withFooterItemPerPage ? 'Hide Item per page' : 'Display Item per page' }}
            </button>
            <button *ngIf="withFooter" class="btn btn-warning ml-2 mr-2 btn-sm" (click)="withFooterPager = !withFooterPager">
              {{ withFooterPager ? 'Hide pager' : 'Display pager' }}
            </button>
            <button class="btn btn-warning ml-2 mr-2 btn-sm" (click)="withFixedHeight = !withFixedHeight">
              {{ withFixedHeight ? 'Auto grid height' : 'Fixed grid height' }}
            </button>
          </fui-demo-datagrid-option-menu>

          <div class="container-fluid mt-2">
            <div class="row">
              <div class="col-auto pt-2">Displayed rows count</div>
              <div class="col-auto">
                <fui-select
                  [layout]="'small'"
                  fuiSelect
                  name="itemPerPage"
                  [addTag]="true"
                  [items]="[5, 10, 20]"
                  [clearable]="false"
                  placeholder="Items per page"
                  (ngModelChange)="itemPerPageChange($event)"
                  [(ngModel)]="itemPerPage"
                >
                  <ng-template ng-label-tmp let-item="item"> {{ item }} items per page</ng-template>
                  <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
                    {{ item || search }} items per page
                  </ng-template>
                  <ng-template ng-tag-tmp let-search="searchTerm"> {{ search }} items per page</ng-template>
                </fui-select>
              </div>
              <div class="col-auto pt-1">
                (You can automatically add a new value within this select. Just type a number an it will be added as a new option)
              </div>
            </div>
          </div>
        </div>
        <div id="testgrid" class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid
            [fixedHeight]="withFixedHeight"
            [exportParams]="exportParams"
            [withHeader]="withHeader"
            [withFooter]="withFooter"
            [withFooterItemPerPage]="withFooterItemPerPage"
            [withFooterPager]="withFooterPager"
            [maxDisplayedRows]="itemPerPage"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs"
            [rowData]="rowData"
            [actionMenuTemplate]="actionMenu"
          >
            <fui-dropdown [fuiCloseMenuOnItemClick]="false">
              <span fuiDropdownTrigger>
                <clr-icon class="dropdown-icon" shape="fui-dots"></clr-icon>
              </span>
              <fui-dropdown-menu fuiPosition="bottom-right" *fuiIfOpen>
                <label class="dropdown-header" aria-hidden="true">Export the grid</label>
                <div fuiDropdownItem (click)="exportGrid()">Export to CSV</div>
                <div class="fui-dropdown-divider" role="separator" aria-hidden="true"></div>
                <label class="dropdown-header" aria-hidden="true">Actions</label>
                <button fuiDropdownItem (click)="sizeColumnsToFit()">Size columns to fit the grid</button>
                <button fuiDropdownItem (click)="autoWidthColumns()">Auto width all columns</button>
                <button fuiDropdownItem (click)="refreshGrid()">Refresh grid</button>
                <button fuiDropdownItem (click)="resetGrid()">Reset grid</button>
                <label class="dropdown-header" aria-hidden="true">Visual actions</label>
                <button fuiDropdownItem (click)="withHeader = !withHeader">
                  {{ withHeader ? 'Hide header' : 'Display header' }}
                </button>
                <button fuiDropdownItem (click)="withFooter = !withFooter">
                  {{ withFooter ? 'Hide footer' : 'Display footer' }}
                </button>
                <button fuiDropdownItem *ngIf="withFooter" (click)="withFooterItemPerPage = !withFooterItemPerPage">
                  {{ withFooterItemPerPage ? 'Hide Item per page' : 'Display Item per page' }}
                </button>
                <button fuiDropdownItem *ngIf="withFooter" (click)="withFooterPager = !withFooterPager">
                  {{ withFooterPager ? 'Hide pager' : 'Display pager' }}
                </button>
                <label class="dropdown-header" aria-hidden="true">Displayed rows count</label>
                <span>
                  <fui-select
                    [layout]="'small'"
                    fuiSelect
                    name="itemPerPage"
                    [addTag]="true"
                    [items]="[5, 10, 20]"
                    [clearable]="false"
                    [appendTo]="'body'"
                    placeholder="Items per page"
                    (ngModelChange)="itemPerPageChange($event)"
                    [(ngModel)]="itemPerPage"
                  >
                    <ng-template ng-label-tmp let-item="item"> {{ item }} items per page</ng-template>
                    <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
                      {{ item || search }} items per page
                    </ng-template>
                    <ng-template ng-tag-tmp let-search="searchTerm"> {{ search }} items per page</ng-template>
                  </fui-select>
                </span>
              </fui-dropdown-menu>
            </fui-dropdown>
          </fui-datagrid>

          <ng-template
            #actionMenu
            let-rowIndex="rowIndex"
            let-onDropdownOpen="onDropdownOpen"
            let-forceClose="forceClose"
            let-appendTo="appendTo"
          >
            <fui-dropdown (dropdownOpenChange)="onDropdownOpen($event)" [forceClose]="forceClose">
              <button class="fui-datagrid-demo-action-btn btn" fuiDropdownTrigger>
                ACTIONS <clr-icon class="dropdown-icon" dir="down" shape="fui-caret"></clr-icon>
              </button>
              <fui-dropdown-menu [appendTo]="appendTo" *fuiIfOpen>
                <div fuiDropdownItem>action 1 for row {{ rowIndex }}</div>
                <div fuiDropdownItem>action 2 for row {{ rowIndex }}</div>
                <div fuiDropdownItem>action 3 for row {{ rowIndex }}</div>
                <div fuiDropdownItem>action 4 for row {{ rowIndex }}</div>
                <div fuiDropdownItem>action 5 for row {{ rowIndex }}</div>
              </fui-dropdown-menu>
            </fui-dropdown>
          </ng-template>

          <ng-template #avatarRenderer let-value="value">
            <img *ngIf="value" width="30" height="30" alt="" [src]="value" />
          </ng-template>

          <ng-template #browserFilter let-column="column" let-filterParams="column.filterParams">
            <fui-datagrid-browser-filter [column]="column" [filterParams]="filterParams"></fui-datagrid-browser-filter>
          </ng-template>

          <ng-template #countryRenderer let-value="value" let-row="row">
            <img
              *ngIf="value"
              width="24"
              height="24"
              [attr.alt]="value"
              [title]="value"
              [attr.src]="'https://www.countryflags.io/' + row.country_code + '/shiny/24.png'"
            />
            {{ value }}
          </ng-template>

          <ng-template #userAgentRenderer let-value="value">
            <span [title]="value" [innerHTML]="datagridService.getIconFor(value) | safeHtml"> </span>
          </ng-template>
        </div>

        <div id="testgrid" class="mb-4" style="width: 100%;">
          <div class="mb-2">
            <h3>Synchronous row data</h3>
          </div>
          <fui-datagrid
            #datagrid2
            [exportParams]="exportParams2"
            [maxDisplayedRows]="itemPerPageSynchronous"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefsSynchronous"
            [rowData]="synchronousRowData"
          >
          </fui-datagrid>
        </div>
      </fui-tab>
      <fui-tab [title]="'Documentation'">
        <p>
          The simplest row model to use is the Client-side Row Model. This row model takes all of the data to be displayed and
          provides the following features inside the grid:
        </p>

        <ul>
          <li>Filtering</li>
          <li>Sorting</li>
        </ul>

        <p>The Client-side Row Model is the default row model for datagrid.</p>

        <h3>How It Works</h3>

        <p>
          You do not need to know how the Client-side Row Model works, however it can be helpful for those who are interested.
        </p>

        <p>
          The Client-side Row Model is responsible for working out how to display the rows inside the grid. It has a complex data
          structure, representing the data in different states. The states are as follows:
        </p>

        <p>The following is an example to help explain each of these steps.</p>

        <h3>State 1: Row Data</h3>

        <p>
          The data as provided by the application. The grid never modifies this array. It just takes the rowData items from it.
          The examples is of three data items.
        </p>

        <p>
          API: There is no API to get this data. However it was provided by the application so you should already have it.
        </p>

        <h3>State 2: All Rows</h3>

        <p>
          allRows is similar to rowData except a new array is created which contains row nodes, each row node pointing to exactly
          one data item. The length of the allRows array is the same as the rowData array.
        </p>

        <p>API: There is no API to get this data. However there is no benefit over the rowsAfterGroup data.</p>

        <h3>State 3: Rows After Filter</h3>

        <p>
          rowsAfterFilter goes through rowsAfterGroup and filters the data. The example shows filtering on the color black (thus
          removing the second group).
        </p>

        <p>API: Use api.forEachNodeAfterFilter() to access this structure.</p>

        <h3>State 4: Rows After Sort</h3>
        <p>rowsAfterSort goes through rowsAfterFilter and sorts the data. The example shows sorting on car make.</p>

        <p>API: Use api.forEachNodeAfterFilterAndSort() to access this structure.</p>
      </fui-tab>
    </fui-tabs>
  `,
  providers: [DatagridService]
})
export class DatagridClientSideComponent {
  rowData: Array<any>;
  synchronousRowData: Array<any>;
  columnDefs: Array<FuiColumnDefinitions>;
  columnDefsSynchronous: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;

  itemPerPage: number = 10;
  itemPerPageSynchronous: number = 5;
  rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;

  withHeader: boolean = true;
  withFooter: boolean = true;
  withFooterItemPerPage: boolean = true;
  withFooterPager: boolean = true;
  withFixedHeight: boolean = false;

  exportParams: CsvExportParams = {
    fileName: 'ferUI-export-test-1'
  };
  exportParams2: CsvExportParams = {
    fileName: 'ferUI-export-test-2'
  };

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;
  @ViewChild('countryRenderer') countryRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('datagrid') datagrid: FuiDatagrid;

  constructor(@Inject(HttpClient) private http: HttpClient, public datagridService: DatagridService) {}

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd'
    };

    this.columnDefs = [
      {
        headerName: 'Avatar',
        field: 'avatar',
        hide: true,
        filter: false,
        cellRenderer: this.avatarRenderer,
        sortable: false
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
        filterParams: dateFilterParams
      },
      { headerName: 'Gender', field: 'gender' },
      { headerName: 'First name', field: 'first_name' },
      { headerName: 'Last name', field: 'last_name' },
      { headerName: 'Age', field: 'age', filter: FilterType.NUMBER },
      { headerName: 'Eye color', field: 'eye_color' },
      { headerName: 'Company', field: 'company' },
      { headerName: 'Address', field: 'address', minWidth: 200 },
      { headerName: 'Country', field: 'country', cellRenderer: this.countryRenderer },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 200 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 200 },
      { headerName: 'Active ?', field: 'is_active', filter: FilterType.BOOLEAN },
      { headerName: 'Registered ?', field: 'is_registered', filter: FilterType.BOOLEAN },
      { headerName: 'Favourite animal', field: 'favourite_animal', minWidth: 150 },
      { headerName: 'Favorite movie', field: 'favorite_movie', minWidth: 200 },
      {
        headerName: 'Browser',
        field: 'user_agent',
        cellRenderer: this.userAgentRenderer,
        sortable: false,
        filter: FilterType.CUSTOM,
        filterFramework: this.browserFilter,
        exportValueFormatter: (value: string): string => {
          return `${this.datagridService.identifyBrowser(value)} (${value})`;
        }
      }
    ];

    this.columnDefsSynchronous = [
      { headerName: 'GUID', field: 'id' },
      { headerName: 'Name', field: 'name' },
      { headerName: 'email', field: 'email' },
      { headerName: 'Address', field: 'address' }
    ];

    this.synchronousRowData = [
      {
        id: 'ec9fb57f-2aab-4675-8048-9e8d9e362e7a',
        name: 'Pixoboo',
        email: 'spoll0@wufoo.com',
        address: '7429 Ohio Plaza'
      },
      {
        id: 'f3bbf3fe-0eec-4cd9-b4f5-85d8d088aac5',
        name: 'Thoughtmix',
        email: 'oconfort1@wordpress.com',
        address: '05 Utah Trail'
      },
      {
        id: '20b1946c-c6ed-4682-a86c-3ab7bcc036a6',
        name: 'Oyoba',
        email: 'cmirralls2@uol.com.br',
        address: '36 Walton Junction'
      },
      {
        id: '3f65ff28-c25b-4369-8bf2-1757f20772b0',
        name: 'Quatz',
        email: 'bcanadas3@tamu.edu',
        address: '3018 Lighthouse Bay Point'
      },
      {
        id: '66018ac7-82ce-4d5a-abfb-b10e77354b65',
        name: 'Myworks',
        email: 'ccargill4@disqus.com',
        address: '7 Burrows Drive'
      },
      {
        id: '02029819-ed4a-48bd-a602-7d24c6a98647',
        name: 'Dazzlesphere',
        email: 'mcoburn5@ihg.com',
        address: '2 Hoffman Point'
      },
      {
        id: 'bbd879a9-49ad-4ae6-8eca-e1ef307e897e',
        name: 'Brainbox',
        email: 'dmaffeo6@ehow.com',
        address: '5925 Farwell Drive'
      },
      {
        id: '5a4ba0fe-a1d1-49a1-b600-82890ec585dd',
        name: 'Tazzy',
        email: 'ovokes7@sogou.com',
        address: '638 Lakeland Junction'
      }
    ];

    this.defaultColumnDefs = {
      sortable: true,
      filter: true
    };

    this.http.get('/datagrid-10k-data.min.json').subscribe((results: IDatagridRowData[]) => {
      setTimeout(() => {
        this.rowData = results;
        // Test empty values.
        // this.rowData = [];
      }, 2000);
    });
  }

  sizeColumnsToFit() {
    this.datagrid.getGridApi().sizeColumnsToFit();
  }

  autoWidthColumns() {
    this.datagrid.getColumnApi().autoSizeAllColumns();
  }

  refreshGrid() {
    this.datagrid.refreshGrid();
  }

  resetGrid() {
    this.datagrid.refreshGrid(true, true);
  }

  itemPerPageChange(value) {
    this.itemPerPage = value;
  }

  exportGrid() {
    this.datagrid.exportGrid();
  }
}
