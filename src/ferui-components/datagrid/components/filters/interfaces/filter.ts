import { Column } from '../../entities/column';
import { FuiColumnDefinitions } from '../../../types/column-definitions';
import { TextComparator } from '../filter/text-filter';
import { FilterType } from './filter.enum';

export interface FuiDatagridIFilter {
  //This is used to let the grid know if the filter is active or not
  isFilterActive(): boolean;

  setFilterActive(value: boolean): void;

  // mandatory methods
  // The grid will ask each active filter, in turn, whether each row in the grid passes. If any
  // filter fails, then the row will be excluded from the final set. The method is provided a
  // params object with attributes node (the rodNode the grid creates that wraps the data) and data
  // (the data object that you provided to the grid for that row).
  doesFilterPass(params: IDoesFilterPassParams): boolean;

  addOrRemoveFilter(condition: boolean, filter: FuiDatagridIFilter): void;

  getColumn(): Column;

  getFilterType(): FilterType;

  getFilterOption(): string;

  getFilterValue(): any;

  getFilterParams(): any;
}

export interface FuiDatagridIGlobalSearchFilter {
  //This is used to let the grid know if the filter is active or not
  isFilterActive(): boolean;

  setFilterActive(value: boolean): void;

  // mandatory methods
  // The grid will ask each active filter, in turn, whether each row in the grid passes. If any
  // filter fails, then the row will be excluded from the final set. The method is provided a
  // params object with attributes node (the rodNode the grid creates that wraps the data) and data
  // (the data object that you provided to the grid for that row).
  doesFilterPass(params: IDoesGlobalFilterPassParams): boolean;

  addOrRemoveFilter(condition: boolean, filter: FuiDatagridIGlobalSearchFilter): void;

  getColumns(): Column[];
}

export interface IDoesFilterPassParams {
  data: any;
}

export interface IGlobalFilterParams {
  columns: Column[];
  rowData: any;
  caseSensitive?: boolean;
  suppressAndOrCondition?: boolean;
  filterChangedCallback?: () => void;
  filterModifiedCallback?: () => void;
  filterOptions?: (IFilterOptionDef | string)[];
  defaultOption?: string;
  textFormatter?: (from: string) => string;
  textCustomComparator?: TextComparator;
}

export interface IDoesGlobalFilterPassParams extends IDoesFilterPassParams {
  rowData: any;
}

export interface FuiDatagridActiveGlobalFilter {
  index: string;
  filter: FuiDatagridIGlobalSearchFilter;
}

export interface IFilterOptionDef {
  displayKey: string;
  displayName: string;
  test: (filterValue: any, cellValue: any) => boolean;
}

export interface IFilterParams {
  column?: Column;
  colDef?: FuiColumnDefinitions;
  filterChangedCallback?: () => void;
  filterModifiedCallback?: () => void;
  filterOptions?: (IFilterOptionDef | string)[];
  defaultOption?: string;
  textFormatter?: (from: string) => string;
}

export interface IComparableFilterParams extends IFilterParams {
  suppressAndOrCondition?: boolean;
}

export interface IScalarFilterParams extends IComparableFilterParams {
  inRangeInclusive?: boolean;
  nullComparator?: NullComparator;
}

export interface IDateFilterParams extends IScalarFilterParams {
  comparator?: IDateComparatorFunc;
  dateFormat?: string;
}

export interface IDateComparatorFunc {
  (filterLocalDateAtMidnight: Date, cellValue: any): number;
}

export interface Comparator<T> {
  (left: T, right: T): number;
}

export interface NullComparator {
  equals?: boolean;
  lessThan?: boolean;
  greaterThan?: boolean;
}
