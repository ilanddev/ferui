import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DatagridService } from '../datagrid.service';
import { IDatagridRowData, RowDataApiService } from '../server-side-api/datagrid-row.service';
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
  TreeNodeData,
  TreeViewConfiguration,
  PagedTreeNodeDataRetriever,
  TreeViewEvent,
  NonRootTreeNode,
  PagingParams,
  FuiTreeViewComponent,
  DatagridOnResizeEvent
} from '@ferui/components';
import { Subject } from 'rxjs';

@Component({
  styleUrls: ['./datagrid-treeview.component.scss'],
  template: `
    <h1 class="mb-4">Infinite server-side datagrid</h1>

    <fui-tabs>
      <div class="mb-4">
        <fui-demo-datagrid-option-menu
          [bandwidthSpeed]="networkBandwith"
          [datagridRowModel]="rowDataModel"
          [datagrid]="datagrid"
          (bandwidthSpeedChange)="networkBandwithChange($event)"
        ></fui-demo-datagrid-option-menu>
      </div>
      <fui-tab [title]="'Examples'" [active]="true">
        <fui-widget>
          <fui-widget-header></fui-widget-header>
          <fui-widget-body>
            <div class="fui-demo-wrapper" [style.height.px]="datagridHeight">
              <div class="fui-demo-treeview-datagrid-flex-container left-side">
                <fui-tree-view
                  #treeView
                  [config]="treeViewConfiguration"
                  [dataRetriever]="treeDataArrayRetriever"
                  [treeNodeData]="treeNodeData"
                  (onNodeEvent)="handleNodeEvent($event)"
                ></fui-tree-view>
              </div>
              <div class="fui-demo-treeview-datagrid-flex-container right-side">
                <fui-datagrid
                  #datagrid
                  [withHeader]="false"
                  [fixedHeight]="true"
                  [rowDataModel]="rowDataModel"
                  [datasource]="dataSource"
                  [maxDisplayedRows]="itemPerPage"
                  [defaultColDefs]="defaultColumnDefs"
                  [columnDefs]="columnDefs"
                  [actionMenuTemplate]="actionMenu"
                  (onDatagridResized)="onGridResized($event)"
                ></fui-datagrid>
                <br /><br />
              </div>
            </div>
          </fui-widget-body>
        </fui-widget>

        <ng-template #treeViewIconTemplate let-node="node">
          <clr-icon *ngIf="node.expanded" class="fui-less-icon" shape="fui-solid-arrow"></clr-icon>
          <clr-icon *ngIf="!node.expanded" class="fui-add-icon" shape="fui-solid-arrow"></clr-icon>
        </ng-template>

        <ng-template #treeViewTemplate let-node="node">
          <img
            width="24"
            height="24"
            [attr.alt]="node.data.nodeLabel"
            [title]="node.data.nodeLabel"
            [attr.src]="'https://www.countryflags.io/' + node.data.data.country_code + '/shiny/24.png'"
          />
          {{ node.data.nodeLabel }}
        </ng-template>

        <ng-template
          #actionMenu
          let-rowIndex="rowIndex"
          let-rowData="rowData"
          let-onDropdownOpen="onDropdownOpen"
          let-forceClose="forceClose"
          let-appendTo="appendTo"
        >
          <fui-dropdown (dropdownOpenChange)="onDropdownOpen($event)" [forceClose]="forceClose">
            <button class="fui-datagrid-demo-action-btn btn" fuiDropdownTrigger>
              <clr-icon class="fui-dots-icon" shape="fui-dots"></clr-icon>
            </button>
            <fui-dropdown-menu [appendTo]="appendTo" *fuiIfOpen>
              <div fuiDropdownItem>action 1 for row {{ rowIndex }} (ID: {{ rowData.id }})</div>
              <div fuiDropdownItem>action 2 for row {{ rowIndex }} (ID: {{ rowData.id }})</div>
              <div fuiDropdownItem>action 3 for row {{ rowIndex }} (ID: {{ rowData.id }})</div>
              <div fuiDropdownItem>action 4 for row {{ rowIndex }} (ID: {{ rowData.id }})</div>
              <div fuiDropdownItem>action 5 for row {{ rowIndex }} (ID: {{ rowData.id }})</div>
            </fui-dropdown-menu>
          </fui-dropdown>
        </ng-template>

        <ng-template #avatarRenderer let-value="value">
          <img *ngIf="value" width="30" height="30" alt="" [attr.src]="value" />
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

        <ng-template #browserFilter let-column="column" let-filterParams="column.filterParams">
          <fui-datagrid-browser-filter [column]="column" [filterParams]="filterParams"></fui-datagrid-browser-filter>
        </ng-template>

        <ng-template #userAgentRenderer let-value="value">
          <span [title]="value" [innerHTML]="datagridService.getIconFor(value) | safeHtml"> </span>
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
        <p>in construction</p>
      </fui-tab>
    </fui-tabs>
  `,
  host: {
    '[class.datagrid-treeview-example]': 'true'
  },
  providers: [DatagridService]
})
export class DatagridTreeviewInfiniteServerSideComponent implements OnInit {
  columnDefs: Array<FuiColumnDefinitions>;
  defaultColumnDefs: FuiColumnDefinitions;
  dataSource: IServerSideDatasource;
  rowDataModel: FuiRowModel = FuiRowModel.INFINITE;
  itemPerPage: number = 5;
  datagridHeight: number = null;

  // Tree view properties
  treeNodeData: TreeNodeData<IDatagridRowData>;
  treeViewConfiguration: TreeViewConfiguration = {};
  treeDataArrayRetriever: PagedTreeNodeDataRetriever<IDatagridRowData>;

  // Selected country
  selectedCountry: string = 'Canada';
  treeviewLoadedSubject: Subject<TreeNodeData<IDatagridRowData>> = new Subject<TreeNodeData<IDatagridRowData>>();

  @ViewChild('treeView') treeView: FuiTreeViewComponent<IDatagridRowData>;
  @ViewChild('treeViewIconTemplate') iconTemplate: TemplateRef<any>;
  @ViewChild('treeViewTemplate') nodeTemplate: TemplateRef<any>;
  @ViewChild('avatarRenderer') avatarRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('userAgentRenderer') userAgentRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('actionsRenderer') actionsRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('idRenderer') idRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('browserFilter') browserFilter: TemplateRef<any>;
  @ViewChild('countryRenderer') countryRenderer: TemplateRef<FuiDatagridBodyCellContext>;
  @ViewChild('datagrid') datagrid: FuiDatagrid;

  networkBandwith: number = 260;

  constructor(private rowDataService: RowDataApiService, public datagridService: DatagridService) {}

  networkBandwithChange(value) {
    this.networkBandwith = value;
  }

  /**
   * Handles node event of Tree View
   */
  handleNodeEvent(event: TreeViewEvent<any>) {
    const node = event.getNode();
    this.selectedCountry = node.nodeLabel;
    this.dataSource = this.serverSideDatasource(this);
  }

  ngOnInit(): void {
    const dateFilterParams: IDateFilterParams = {
      dateFormat: 'yyyy-mm-dd'
    };

    this.columnDefs = [
      { headerName: 'ID', field: 'id', cellRenderer: this.idRenderer, filter: FilterType.NUMBER },
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
      { headerName: 'Address', field: 'address', minWidth: 150 },
      { headerName: 'Country', field: 'country', cellRenderer: this.countryRenderer },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', minWidth: 150 },
      { headerName: 'Ip-address', field: 'ip_address', minWidth: 150 },
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
        filterFramework: this.browserFilter
      }
    ];

    this.defaultColumnDefs = {
      sortable: true,
      filter: true
    };

    // For testing purposes we're using 'this'. But in production we should create an object that
    // contains all possible value needed
    this.dataSource = this.serverSideDatasource(this);

    this.initTreeView();
  }

  onGridResized(event: DatagridOnResizeEvent) {
    this.datagridHeight = event.height;
  }

  private serverSideDatasource(server: DatagridTreeviewInfiniteServerSideComponent): IServerSideDatasource {
    return {
      getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject> {
        return new Promise((resolve, reject) => {
          server.rowDataService.getGroupedRows(params, 'country', server.selectedCountry).subscribe(
            (results: IDatagridResultObject) => {
              const delay: number = server.networkBandwith;
              setTimeout(() => {
                resolve(results);
              }, delay);
            },
            error => {
              reject(error);
            }
          );
        });
      }
    };
  }

  /**
   * Initialize the Tree View Component with the chosen O365 Mailbox as top parent
   */
  private initTreeView(): void {
    this.treeNodeData = NonRootTreeNode.instance;
    this.treeDataArrayRetriever = pagedTreeNodeDataRetriever(this);

    function pagedTreeNodeDataRetriever(
      server: DatagridTreeviewInfiniteServerSideComponent
    ): PagedTreeNodeDataRetriever<IDatagridRowData> {
      return {
        getChildNodeData: (parent: TreeNodeData<IDatagridRowData>) => void 0,
        hasChildNodes: (node: TreeNodeData<IDatagridRowData>) => {
          return Promise.resolve(false);
        },
        async getPagedChildNodeData(
          node: TreeNodeData<IDatagridRowData>,
          p: PagingParams
        ): Promise<TreeNodeData<IDatagridRowData>[]> {
          return new Promise<TreeNodeData<IDatagridRowData>[]>(resolve => {
            const countrySortModel = {
              id: 'country',
              visible: true,
              name: 'Country',
              field: 'country',
              sortable: true,
              sort: 'asc',
              sortOrder: 0,
              sortType: 'string'
            };
            server.rowDataService
              .getRows({ request: { offset: p.offset, limit: p.limit, sortModel: [countrySortModel] } }, 0, false, 'country')
              .subscribe(response => {
                const rows = response.data.map(it => {
                  return {
                    data: it,
                    nodeLabel: it.country
                  };
                });
                resolve(rows);
                // get Canada and send it.
                server.treeviewLoadedSubject.next(
                  rows.find(nodeData => {
                    return nodeData.nodeLabel === server.selectedCountry;
                  })
                );
              });
          });
        },
        getIconTemplate: () => {
          return server.iconTemplate;
        },
        getNodeTemplate: () => {
          return server.nodeTemplate;
        }
      };
    }

    this.treeviewLoadedSubject.asObservable().subscribe((treenode: TreeNodeData<IDatagridRowData>) => {
      if (treenode) {
        setTimeout(() => {
          this.treeView.selectNode(treenode); // We select the first top node to show its data retrieval
        });
      }
    });
  }
}
