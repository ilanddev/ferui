export interface IServerSideDatasource {
  // The context object to use within the getRows function.
  context?: any;

  // grid calls this to get rows
  getRows(params: IServerSideGetRowsParams): Promise<IDatagridResultObject>;
}

export interface IServerSideGetRowsParams {
  // details for the request, simple object, can be converted to JSON
  request: IServerSideGetRowsRequest;
}

export interface IServerSideGetRowsRequest {
  // value columns
  columns?: ColumnVO[];

  // if filtering, what the filter model is
  filterModel?: FilterModel[];

  // if sorting, what the sort model is
  sortModel?: SortModel[];

  offset: number;

  limit: number;
}

export interface IDatagridResultObject {
  total?: number; // The total result is optional.
  // If the server doesn't return this value the datagrid pager will adapt itself.
  data: any[]; // The current chunk of data coming from the server.
}

// we pass a VO (Value Object) of the column and not the column itself,
// so the data can be converted to a JSON string and passed to server-side
export interface ColumnVO {
  id: string;
  displayName: string;
  field: string;
}

export interface SortModel {
  id: string;
  visible: boolean;
  name: string;
  field: string;
  sortable: boolean;
  sort: string;
  sortType: string;
  sortOrder: number;
}

export interface FilterModel {
  id: string;
  visible: boolean;
  name: string;
  field: string;
  filterable: boolean;
  filterType: string;
  filterValue: any | any[];
  filterOption: string;
  filterParams?: any;
}

export interface ServerSideRowModelInterface {
  datasource: IServerSideDatasource;
  params: IServerSideGetRowsParams;
  offset: number;
  limit: number;
  totalRows: number | null;
  reset(): void;
  refresh(limit: number, datasource?: IServerSideDatasource): void;
}
