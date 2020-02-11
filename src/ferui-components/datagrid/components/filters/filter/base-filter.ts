import { FuiDatagridIFilter, IDoesFilterPassParams, IFilterParams } from '../interfaces/filter';
import { Column } from '../../entities/column';
import { Input, OnInit, Type } from '@angular/core';
import { FuiFormLayoutEnum } from '../../../../forms/common/layout.enum';
import { FuiDatagridFilterService } from '../../../services/datagrid-filter.service';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { FilterType } from '../interfaces/filter.enum';

const DEFAULT_TRANSLATIONS: { [name: string]: string } = {
  loadingOoo: 'Loading...',
  empty: 'Choose One',
  equals: 'Equals',
  notEqual: 'Not equal',
  lessThan: 'Less than',
  greaterThan: 'Greater than',
  inRange: 'In range',
  lessThanOrEqual: 'Less than or equals',
  greaterThanOrEqual: 'Greater than or equals',
  filterOoo: 'Filter...',
  contains: 'Contains',
  notContains: 'Not contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  searchOoo: 'Search...',
  selectAll: 'Select All',
  applyFilter: 'Apply Filter',
  clearFilter: 'Clear Filter',
  andCondition: 'AND',
  orCondition: 'OR',
  filterType: 'Type',
  filterBetween: 'Between',
  filterAnd: 'And'
};

export abstract class FuiDatagridBaseFilter<P extends IFilterParams> implements FuiDatagridIFilter, OnInit {
  public static EMPTY = 'empty';
  public static EQUALS = 'equals';
  public static NOT_EQUAL = 'notEqual';
  public static LESS_THAN = 'lessThan';
  public static LESS_THAN_OR_EQUAL = 'lessThanOrEqual';
  public static GREATER_THAN = 'greaterThan';
  public static GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual';
  public static IN_RANGE = 'inRange';

  public static CONTAINS = 'contains'; //1;
  public static NOT_CONTAINS = 'notContains'; //1;
  public static STARTS_WITH = 'startsWith'; //4;
  public static ENDS_WITH = 'endsWith'; //5;

  @Input() filterParams: P;
  @Input() column: Column;

  defaultFilter: string;
  fuiFormLayoutEnum = FuiFormLayoutEnum;

  protected defaultParams: IFilterParams;
  protected _isActive: boolean;

  setFilterActive(value: boolean): void {
    this._isActive = value;
  }

  //This is used to let the grid know if the filter is active or not
  isFilterActive(): boolean {
    return this._isActive;
  }

  // mandatory methods
  // The grid will ask each active filter, in turn, whether each row in the grid passes. If any
  // filter fails, then the row will be excluded from the final set. The method is provided a
  // params object with attributes node (the rodNode the grid creates that wraps the data) and data
  // (the data object that you provided to the grid for that row).
  abstract doesFilterPass(params: IDoesFilterPassParams): boolean;

  abstract getFilterOption(): string;

  abstract getFilterValue(): any;

  // By default the filter is set to custom.
  getFilterType(): FilterType {
    return FilterType.CUSTOM;
  }

  getColumn(): Column {
    return this.column;
  }

  getFilterParams(): P {
    return this.filterParams;
  }

  getColumnName() {
    return this.column.name;
  }

  getFilterService(): FuiDatagridFilterService | null {
    if (this.column && this.column.getGridApi()) {
      return this.column.getGridApi().filterService;
    }
    return null;
  }

  // This method should be called every-time the user do a change with the filter.
  // This will update the saved filter or remove it if the user remove the filter.
  addOrRemoveFilter(condition: boolean, filter: FuiDatagridIFilter): void {
    if (this.getFilterService()) {
      if (condition) {
        filter.setFilterActive(true);
        this.getFilterService().addFilter(filter);
      } else {
        filter.setFilterActive(false);
        this.getFilterService().removeFilter(filter);
      }
    }
  }

  init() {
    this.defaultFilter = this.filterParams.defaultOption ? this.filterParams.defaultOption : null;
  }

  ngOnInit(): void {
    this.defaultParams = {
      column: this.column,
      colDef: this.column.getColumnDefinition()
    };
    this.filterParams = DatagridUtils.mergeObjects(this.defaultParams, this.filterParams) as P;
    this.init();
  }

  translate(toTranslate: string): string {
    return DEFAULT_TRANSLATIONS[toTranslate];
  }
}
