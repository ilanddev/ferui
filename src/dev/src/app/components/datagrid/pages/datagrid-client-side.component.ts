import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FuiDatagridBodyCellContext,
  FuiColumnDefinitions,
  FuiDatagridSortDirections,
  FuiFieldTypes,
  FilterType,
  IDateFilterParams,
  FuiRowModel,
} from '@ferui/components';
import { DatagridService } from '../datagrid.service';

@Component({
  template: `
    <h1 class="mt-4 mb-4">Client-side datagrid</h1>

    <fui-tabs>
      <fui-tab [title]="'Examples'" [active]="true">
        <div class="mb-2">
          <fui-demo-datagrid-option-menu
            [datagridRowModel]="rowDataModel"
            [datagrid]="datagrid"
          ></fui-demo-datagrid-option-menu>

          <div class="container-fluid mt-2">
            <div class="row">
              <div class="col-auto pt-2">Displayed rows count</div>
              <div class="col-auto">
                <ng-select
                  [layout]="'small'"
                  fuiSelect
                  name="itemPerPage"
                  [addTag]="true"
                  [items]="[10]"
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
                </ng-select>
              </div>
              <div class="col-auto pt-1">
                (You can automatically add a new value within this select. Just type a number an it will be added as a new
                option)
              </div>
            </div>
          </div>
        </div>
        <div class="mb-4" style="width: 100%;">
          <fui-datagrid
            #datagrid
            [isLoading]="isLoading"
            [maxDisplayedRows]="itemPerPage"
            [gridHeight]="'677px'"
            [defaultColDefs]="defaultColumnDefs"
            [columnDefs]="columnDefs"
            [rowData]="rowData"
          ></fui-datagrid>

          <ng-template #avatarRenderer let-value="value">
            <img *ngIf="value" width="30" height="30" alt="" [src]="value" />
          </ng-template>

          <ng-template #browserFilter let-column="column" let-filterParams="column.filterParams">
            <fui-datagrid-browser-filter [column]="column" [filterParams]="filterParams"></fui-datagrid-browser-filter>
          </ng-template>

          <ng-template #userAgentRenderer let-value="value" let-row="row">
            <span [title]="row.user_agent" [innerHTML]="datagridService.getIconFor(value) | safeHtml"> </span>
          </ng-template>
        </div>
      </fui-tab>
      <fui-tab [title]="'Documentation'">
        ...
      </fui-tab>
    </fui-tabs>
  `,
  providers: [DatagridService],
})
export class DatagridClientSideComponent {
  rowData: Array<any>;
  columnDefs: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  isLoading: boolean = true;
  itemPerPage: number = 10;
  rowDataModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;

  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;

  constructor(@Inject(HttpClient) private http: HttpClient, public datagridService: DatagridService) {}

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd',
    };

    this.columnDefs = [
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
      { headerName: 'Address', field: 'address', minWidth: 200 },
      { headerName: 'Country', field: 'country' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 200 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 200 },
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

    this.http.get('/datagrid-10k-data.min.json').subscribe((results: Array<any>) => {
      this.isLoading = false;
      this.rowData = results;
    });
  }

  itemPerPageChange(value) {
    this.itemPerPage = value;
  }
}
