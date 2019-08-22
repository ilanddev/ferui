import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  IDatagridResultObject,
  IServerSideGetRowsParams,
  FilterModel,
  FilterType,
  FuiDatagridTextFilter,
  FuiDatagridBooleanFilter,
  Comparator,
  FuiDatagridNumberFilter,
  FuiDatagridDateFilter,
  NullComparator,
  FuiFieldTypes,
  SortModel,
  FuiDatagridSortDirections,
  DateIOService,
  orderByComparator,
} from '@ferui/components';

export interface IDatagridRowData {
  id: number;
  username: string;
  gender: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  eye_color: string;
  company: string;
  address: string;
  country: string;
  phone: string;
  ip_address: string;
  is_active: boolean;
  is_registered: boolean;
  avatar: string;
  favourite_animal: string;
  creation_date: string;
  epoch_date: number;
  favorite_movie: string;
  user_agent: string;
  browser: string;
}

const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root',
})
export class RowDataApiService {
  SERVER_URL: string = 'api/rows';

  constructor(private httpClient: HttpClient, private dateIOService: DateIOService) {}

  getRows(
    params: IServerSideGetRowsParams,
    maxResults: number = 0,
    withTotalRows: boolean = true
  ): Observable<IDatagridResultObject> {
    const subject = new Subject<IDatagridResultObject>();

    this.httpClient
      .get<IDatagridRowData[]>(this.SERVER_URL)
      .pipe(catchError(this.handleError))
      .subscribe(results => {
        const res = maxResults === 0 ? results : results.slice(0, maxResults);
        // DO THE FILTERING
        let filteredAndSortedData: any[] = this.filterData(res, params);

        // DO THE SORTING
        filteredAndSortedData = this.sortData(filteredAndSortedData, params);

        // Split the results into chunks
        const offset: number = params.request.offset;
        const limit: number = params.request.limit;
        const calc: number = offset + limit;
        const chunkedData = filteredAndSortedData.slice(
          offset,
          calc > filteredAndSortedData.length ? filteredAndSortedData.length : calc
        );

        // Return the filtered and sorted value.
        if (withTotalRows) {
          subject.next({
            total: filteredAndSortedData.length,
            data: chunkedData,
          });
        } else {
          subject.next({
            data: chunkedData,
          });
        }
      });

    return subject.asObservable();
  }

  getHundredRows(params: IServerSideGetRowsParams, withTotalRows: boolean = true): Observable<IDatagridResultObject> {
    return this.getRows(params, 100, withTotalRows);
  }

  getRow(rowId: number): Observable<IDatagridRowData> {
    return this.httpClient.get<IDatagridRowData>(`${this.SERVER_URL}/${rowId}`).pipe(catchError(this.handleError));
  }

  addRow(row: IDatagridRowData): Observable<IDatagridRowData> {
    return this.httpClient.post<IDatagridRowData>(this.SERVER_URL, row, cudOptions).pipe(catchError(this.handleError));
  }

  deleteRow(row: IDatagridRowData | number): Observable<IDatagridRowData> {
    const id = typeof row === 'number' ? row : row.id;
    return this.httpClient
      .delete<IDatagridRowData>(`${this.SERVER_URL}/${id}`, cudOptions)
      .pipe(catchError(this.handleError));
  }

  updateRow(row: IDatagridRowData): Observable<null | IDatagridRowData> {
    return this.httpClient.put<IDatagridRowData>(this.SERVER_URL, row, cudOptions).pipe(catchError(this.handleError));
  }

  search(term: string): Observable<IDatagridRowData[]> {
    term = term.trim();
    // add safe, encoded search parameter if term is present
    const options = term ? { params: new HttpParams().set('name', term) } : {};

    return this.httpClient.get<IDatagridRowData[]>(this.SERVER_URL, options).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error(error); // log to console instead
    return throwError(error);
  }

  private filterData(results: any[], params: IServerSideGetRowsParams): any[] {
    const filters: FilterModel[] = params.request.filterModel ? params.request.filterModel : [];
    if (filters.length === 0) {
      return [...results];
    }

    const filteredData: any[] = [];
    let doesFiltersPass: boolean = true;
    let added: boolean = false;
    //let globalSearchPass: boolean = false;
    results.forEach(data => {
      added = false;
      doesFiltersPass = true;

      for (const filter of filters) {
        if (!this.doesFilterPass(filter, data[filter.field])) {
          doesFiltersPass = false;
          break;
        }
      }

      // if (this.hasGlobalSearchFilter()) {
      //   const filter: FuiDatagridIGlobalSearchFilter = this.globalSearchFilter.filter;
      //   const doesPassParams: IDoesGlobalFilterPassParams = {
      //     rowData: data,
      //     data: null
      //   };
      //   globalSearchPass = filter.doesFilterPass(doesPassParams);
      //
      //   if ((condition === 'or' && globalSearchPass && !added) ||
      //     (condition === 'and' && globalSearchPass && doesFiltersPass)) {
      //     added = true;
      //     filteredData.push(data);
      //   }
      // } else if (condition === 'and' && doesFiltersPass) {
      //   filteredData.push(data);
      // }

      if (doesFiltersPass) {
        filteredData.push(data);
      }
    });
    return filteredData;
  }

  private doesFilterPass(filter: FilterModel, data: any): boolean {
    if (filter.filterType === FilterType.STRING) {
      return this.textFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FilterType.NUMBER) {
      return this.numberFilter(filter.filterOption, filter.filterValue, data);
    } else if (filter.filterType === FilterType.BOOLEAN) {
      return this.booleanFilter(filter.filterValue, data);
    } else if (filter.filterType === FilterType.DATE) {
      return this.dateFilter(filter.filterOption, filter.filterValue, data);
    }
    return false;
  }

  private textFilter(selectedType: string, selectedSearch: string, data: string): boolean {
    const formatter = FuiDatagridTextFilter.DEFAULT_LOWERCASE_FORMATTER;
    const comparator = FuiDatagridTextFilter.DEFAULT_COMPARATOR;
    return comparator(selectedType, formatter(data), formatter(selectedSearch));
  }

  private booleanFilter(selectedValue: string | boolean, data: string | boolean): boolean {
    const formatter = FuiDatagridBooleanFilter.DEFAULT_FORMATTER;
    if (data === null && data === undefined && data === '') {
      return false;
    }
    return formatter(data) === formatter(selectedValue);
  }

  private numberFilter(selectedType: string, filterValues: number | number[], data: number): boolean {
    const cellValue: any = data;
    const filterValue: number = Array.isArray(filterValues) ? filterValues[0] : filterValues;
    const comparator: Comparator<number> = this.nullComparator(selectedType, this.numberComparator());
    const compareResult = comparator(filterValue, cellValue);

    switch (selectedType) {
      case FuiDatagridNumberFilter.EMPTY:
        return false;
      case FuiDatagridNumberFilter.EQUALS:
        return compareResult === 0;
      case FuiDatagridNumberFilter.GREATER_THAN:
        return compareResult > 0;
      case FuiDatagridNumberFilter.GREATER_THAN_OR_EQUAL:
        return compareResult >= 0;
      case FuiDatagridNumberFilter.LESS_THAN_OR_EQUAL:
        return compareResult <= 0;
      case FuiDatagridNumberFilter.LESS_THAN:
        return compareResult < 0;
      case FuiDatagridNumberFilter.NOT_EQUAL:
        return compareResult !== 0;
      case FuiDatagridNumberFilter.IN_RANGE:
        const compareToResult: number = comparator((filterValues as number[])[1], cellValue);
        return compareResult >= 0 && compareToResult <= 0;
      default:
        throw new Error('Unexpected type of filter: ' + selectedType);
    }
  }

  private dateFilter(
    selectedType: string,
    filterValues: string | string[],
    data: string,
    dateFormat: string = 'yyyy-mm-dd'
  ): boolean {
    function toDate(value: string | string[]): Date | Date[] | null {
      if (!value) {
        return null;
      }
      if (Array.isArray(value)) {
        return value.map(str => new Date(str));
      } else {
        return new Date(value);
      }
    }

    const cellValue: any = data;
    const rawFilterValues: Date[] | Date = toDate(filterValues);
    const filterValue: Date = Array.isArray(rawFilterValues) ? rawFilterValues[0] : rawFilterValues;

    const comparator: Comparator<Date> = this.nullComparator(selectedType, this.dateComparator(dateFormat));
    const compareResult = comparator(filterValue, cellValue);

    switch (selectedType) {
      case FuiDatagridDateFilter.EMPTY:
        return false;
      case FuiDatagridDateFilter.EQUALS:
        return compareResult === 0;
      case FuiDatagridDateFilter.GREATER_THAN:
        return compareResult > 0;
      case FuiDatagridDateFilter.LESS_THAN:
        return compareResult < 0;
      case FuiDatagridDateFilter.NOT_EQUAL:
        return compareResult !== 0;
      case FuiDatagridDateFilter.IN_RANGE:
        const compareToResult: number = comparator(rawFilterValues[1], cellValue);
        return compareResult >= 0 && compareToResult <= 0;
      default:
        throw new Error('Unexpected type of filter: ' + selectedType);
    }
  }

  private numberComparator(): Comparator<number> {
    return (left: number, right: number): number => {
      if (left === right) {
        return 0;
      }
      if (left < right) {
        return 1;
      }
      if (left > right) {
        return -1;
      }
    };
  }

  private dateComparator(dateFormat): Comparator<Date> {
    return (filterDate: Date, cellValue: any): number => {
      //The default comparator assumes that the cellValue is a date
      const cellAsDate: Date =
        cellValue instanceof Date
          ? cellValue
          : this.dateIOService.getDateValueFromDateOrString(
              this.dateIOService.convertDateStringToLocalString(cellValue, dateFormat)
            );

      if (cellAsDate < filterDate) {
        return -1;
      }
      if (cellAsDate > filterDate) {
        return 1;
      }
      return cellValue !== null ? 0 : -1;
    };
  }

  private translateNull(type: string): boolean {
    const reducedType: string =
      type.indexOf('greater') > -1 ? 'greaterThan' : type.indexOf('lessThan') > -1 ? 'lessThan' : 'equals';
    return (FuiDatagridNumberFilter.DEFAULT_NULL_COMPARATOR as NullComparator)[reducedType];
  }

  private nullComparator(selectedType: string, comparator: Comparator<number | Date>): Comparator<number | Date> {
    return (filterValue: number, gridValue: number): number => {
      if (gridValue === null) {
        const nullValue = this.translateNull(selectedType);
        switch (selectedType) {
          case FuiDatagridNumberFilter.EMPTY:
            return 0;
          case FuiDatagridNumberFilter.EQUALS:
            return nullValue ? 0 : 1;
          case FuiDatagridNumberFilter.GREATER_THAN:
            return nullValue ? 1 : -1;
          case FuiDatagridNumberFilter.GREATER_THAN_OR_EQUAL:
            return nullValue ? 1 : -1;
          case FuiDatagridNumberFilter.LESS_THAN_OR_EQUAL:
            return nullValue ? -1 : 1;
          case FuiDatagridNumberFilter.LESS_THAN:
            return nullValue ? -1 : 1;
          case FuiDatagridNumberFilter.NOT_EQUAL:
            return nullValue ? 1 : 0;
          default:
            break;
        }
      }
      return comparator(filterValue, gridValue);
    };
  }

  private sortData(results: any[], params: IServerSideGetRowsParams): any[] {
    const rowToIndexMap = new Map<any, number>();
    results.forEach((row, index) => rowToIndexMap.set(row, index));

    function manageFieldType(field, column) {
      if (column.sortType && column.sortType === FuiFieldTypes.DATE && !(field[column.field] instanceof Date)) {
        return new Date(field[column.field]);
      } else if (column.sortType && column.sortType === FuiFieldTypes.NUMBER) {
        return Number(field[column.field]);
      } else {
        return field[column.field];
      }
    }

    const columns: SortModel[] = params.request.sortModel || [];
    const sortedColumns: SortModel[] = columns.sort((a: SortModel, b: SortModel) => {
      const aOrder = a.sortOrder;
      const bOrder = b.sortOrder;
      let comparison = 0;
      if (aOrder > bOrder) {
        comparison = 1;
      } else if (aOrder < bOrder) {
        comparison = -1;
      }
      return comparison;
    });

    const temp = [...results];
    return temp.sort((a: any, b: any) => {
      for (const column of sortedColumns) {
        const propA = manageFieldType(a, column);
        const propB = manageFieldType(b, column);

        const comparison =
          column.sort !== FuiDatagridSortDirections.DESC
            ? orderByComparator(propA, propB)
            : -orderByComparator(propA, propB);

        // Don't return 0 yet in case of needing to sort by next property
        if (comparison !== 0) {
          return comparison;
        }
      }

      if (!(rowToIndexMap.has(a) && rowToIndexMap.has(b))) {
        return 0;
      }
      return rowToIndexMap.get(a) < rowToIndexMap.get(b) ? -1 : 1;
    });
  }
}
