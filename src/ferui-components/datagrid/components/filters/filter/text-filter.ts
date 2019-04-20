import { Component, OnInit } from '@angular/core';
import { FuiDatagridBaseFilter } from './base-filter';
import { IComparableFilterParams, IDoesFilterPassParams } from '../interfaces/filter';
import { FilterType } from '../interfaces/filter.enum';

export interface TextFormatter {
  (from: string): string;
}

export interface TextComparator {
  (filter: string, gridValue: any, filterText: string): boolean;
}

export interface ITextFilterParams extends IComparableFilterParams {
  textCustomComparator?: TextComparator;
  debounceMs?: number;
  caseSensitive?: boolean;
}

export function DEFAULT_TEXT_FORMATTER(from: string): string {
  return from;
}

export function DEFAULT_TEXT_LOWERCASE_FORMATTER(from: string): string {
  if (!from) {
    return null;
  }
  return from.toString().toLowerCase();
}

export function DEFAULT_TEXT_COMPARATOR(filter: string, value: any, filterText: string): boolean {
  switch (filter) {
    case FuiDatagridTextFilter.CONTAINS:
      return value.indexOf(filterText) >= 0;
    case FuiDatagridTextFilter.NOT_CONTAINS:
      return value.indexOf(filterText) === -1;
    case FuiDatagridTextFilter.EQUALS:
      return value === filterText;
    case FuiDatagridTextFilter.NOT_EQUAL:
      return value !== filterText;
    case FuiDatagridTextFilter.STARTS_WITH:
      return value.indexOf(filterText) === 0;
    case FuiDatagridTextFilter.ENDS_WITH:
      const index = value.lastIndexOf(filterText);
      return index >= 0 && index === value.length - filterText.length;
    default:
      // should never happen
      console.warn('invalid filter type ' + filter);
      return false;
  }
}

@Component({
  selector: 'fui-datagrid-text-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-dg-filters-column-name" unselectable="on">
        {{ getColumnName() }}
      </div>
      <div class="col-3">
        <fui-select-container>
          <label></label>
          <ng-select
            fuiSelect
            name="fuiDatagridTextFilterType"
            appendTo=".fui-datagrid-filters-popover"
            [layout]="fuiFormLayoutEnum.SMALL"
            [clearable]="false"
            (ngModelChange)="onFilterTypeChanged($event)"
            [(ngModel)]="selectedType"
          >
            <ng-option *ngFor="let type of getApplicableFilterTypes()" [value]="type">{{ translate(type) }}</ng-option>
          </ng-select>
        </fui-select-container>
      </div>
      <div class="col-3">
        <fui-input-container>
          <label>{{ translate('filterOoo') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            type="text"
            (ngModelChange)="onFilterInputChanged($event)"
            fuiInput
            name="fuiDatagridTextFilterSearch"
            [(ngModel)]="selectedSearch"
          />
        </fui-input-container>
      </div>
      <div class="col-3"></div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-text-filter container-fluid',
  },
})
export class FuiDatagridTextFilter extends FuiDatagridBaseFilter<ITextFilterParams> implements OnInit {
  static DEFAULT_FORMATTER: TextFormatter = DEFAULT_TEXT_FORMATTER;
  static DEFAULT_LOWERCASE_FORMATTER: TextFormatter = DEFAULT_TEXT_LOWERCASE_FORMATTER;
  static DEFAULT_COMPARATOR: TextComparator = DEFAULT_TEXT_COMPARATOR;

  selectedType: string;
  selectedSearch: string = '';

  private comparator: TextComparator;
  private formatter: TextFormatter;

  getApplicableFilterTypes(): string[] {
    return [
      FuiDatagridTextFilter.EQUALS,
      FuiDatagridTextFilter.NOT_EQUAL,
      FuiDatagridTextFilter.STARTS_WITH,
      FuiDatagridTextFilter.ENDS_WITH,
      FuiDatagridTextFilter.CONTAINS,
      FuiDatagridTextFilter.NOT_CONTAINS,
    ];
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.comparator(this.selectedType, this.formatter(params.data), this.formatter(this.selectedSearch));
  }

  getFilterType(): FilterType {
    return FilterType.STRING;
  }

  getFilterOption(): string {
    return this.selectedType;
  }

  getFilterValue(): any {
    return this.selectedSearch;
  }

  onFilterTypeChanged(value: string) {
    this.selectedType = value;
    this.onChange();
  }

  onFilterInputChanged(value: string) {
    this.selectedSearch = value;
    this.onChange();
  }

  onChange() {
    this.addOrRemoveFilter(this.selectedSearch !== '', this);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedType = FuiDatagridTextFilter.getDefaultType();

    if (this.getFilterService()) {
      const filter = this.getFilterService().getFilterFor(this.column);
      if (filter && filter instanceof FuiDatagridTextFilter) {
        this.selectedSearch = filter.selectedSearch;
        this.selectedType = filter.selectedType;
      }
    }

    this.defaultFilter = this.selectedType;
    if (!this.filterParams.caseSensitive) {
      this.filterParams.caseSensitive = false;
    }
    if (!this.filterParams.suppressAndOrCondition) {
      this.filterParams.suppressAndOrCondition = false;
    }
    if (!this.filterParams.defaultOption) {
      this.filterParams.defaultOption = FuiDatagridTextFilter.getDefaultType();
    }
    super.init();
    this.comparator = this.filterParams.textCustomComparator
      ? this.filterParams.textCustomComparator
      : FuiDatagridTextFilter.DEFAULT_COMPARATOR;
    this.formatter = this.filterParams.textFormatter
      ? this.filterParams.textFormatter
      : this.filterParams.caseSensitive === true
      ? FuiDatagridTextFilter.DEFAULT_FORMATTER
      : FuiDatagridTextFilter.DEFAULT_LOWERCASE_FORMATTER;
  }

  static getDefaultType(): string {
    return FuiDatagridTextFilter.EQUALS;
  }
}
