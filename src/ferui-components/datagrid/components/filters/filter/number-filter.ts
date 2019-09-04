import { Component, OnInit } from '@angular/core';
import { FuiDatagridBaseFilter } from './base-filter';
import { Comparator, IDoesFilterPassParams, IScalarFilterParams, NullComparator } from '../interfaces/filter';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { FilterType } from '../interfaces/filter.enum';

export interface INumberFilterParams extends IScalarFilterParams {
  debounceMs?: number;
}

@Component({
  selector: 'fui-datagrid-number-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-dg-filters-column-name" unselectable="on">
        {{ getColumnName() }}
      </div>
      <div class="col-3">
        <fui-select-container>
          <label></label>
          <fui-select
            fuiSelect
            name="fuiDatagridNumberFilterType"
            appendTo=".fui-datagrid-filters-popover"
            [layout]="fuiFormLayoutEnum.SMALL"
            [clearable]="false"
            (ngModelChange)="onFilterTypeChanged($event)"
            [(ngModel)]="selectedType"
          >
            <ng-option *ngFor="let type of getApplicableFilterTypes()" [value]="type">{{ translate(type) }}</ng-option>
          </fui-select>
        </fui-select-container>
      </div>
      <div class="col-3">
        <fui-input-container>
          <label>{{ isInRange() ? translate('filterBetween') : translate('filterOoo') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            type="number"
            (ngModelChange)="onFilterInputChanged($event, 'search')"
            fuiInput
            name="fuiDatagridNumberFilterSearch"
            [required]="isInRange()"
            [(ngModel)]="selectedSearch"
          />
        </fui-input-container>
      </div>
      <div class="col-3">
        <fui-input-container *ngIf="isInRange()">
          <label>{{ translate('filterAnd') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            type="number"
            (ngModelChange)="onFilterInputChanged($event, 'searchTo')"
            fuiInput
            name="fuiDatagridNumberFilterSearchTo"
            required
            [(ngModel)]="selectedSearchTo"
          />
        </fui-input-container>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-number-filter container-fluid',
  },
})
export class FuiDatagridNumberFilter extends FuiDatagridBaseFilter<INumberFilterParams> implements OnInit {
  static readonly DEFAULT_NULL_COMPARATOR: NullComparator = {
    equals: false,
    lessThan: false,
    greaterThan: false,
  };

  selectedType: string;
  selectedSearch: string = '';
  selectedSearchTo: string = '';

  getApplicableFilterTypes(): string[] {
    return [
      FuiDatagridNumberFilter.EQUALS,
      FuiDatagridNumberFilter.NOT_EQUAL,
      FuiDatagridNumberFilter.LESS_THAN,
      FuiDatagridNumberFilter.LESS_THAN_OR_EQUAL,
      FuiDatagridNumberFilter.GREATER_THAN,
      FuiDatagridNumberFilter.GREATER_THAN_OR_EQUAL,
      FuiDatagridNumberFilter.IN_RANGE,
    ];
  }

  isInRange(): boolean {
    return this.selectedType === FuiDatagridNumberFilter.IN_RANGE;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const cellValue: any = params.data;
    const rawFilterValues: number[] | number = this.filterValues();
    const filterValue: number = Array.isArray(rawFilterValues) ? rawFilterValues[0] : rawFilterValues;

    // const customFilterOption = this.customFilterOptions[this.selectedType];
    // if (customFilterOption) {
    //   // only execute the custom filter if a value exists or a value isn't required, i.e. input is hidden
    //   if (filterValue != null || customFilterOption.hideFilterInput) {
    //     return customFilterOption.test(filterValue, cellValue);
    //   }
    // }

    const comparator: Comparator<number> = this.nullComparator(this.selectedType as string);
    const compareResult = comparator(filterValue, cellValue);

    switch (this.selectedType) {
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
        const compareToResult: number = comparator((rawFilterValues as number[])[1], cellValue);
        if (!this.filterParams.inRangeInclusive) {
          return compareResult > 0 && compareToResult < 0;
        } else {
          return compareResult >= 0 && compareToResult <= 0;
        }
      default:
        throw new Error('Unexpected type of filter: ' + this.selectedType);
    }
  }

  getFilterType(): FilterType {
    return FilterType.NUMBER;
  }

  getFilterOption(): string {
    return this.selectedType;
  }

  getFilterValue(): any {
    return this.filterValues();
  }

  public filterValues(): number | number[] {
    return this.selectedType !== FuiDatagridNumberFilter.IN_RANGE
      ? this.asNumber(this.selectedSearch)
      : [this.asNumber(this.selectedSearch), this.asNumber(this.selectedSearchTo)];
  }

  onFilterTypeChanged(value: string) {
    this.selectedType = value;
    this.onChange();
  }

  onFilterInputChanged(value: string, type: string) {
    if (type === 'search') {
      this.selectedSearch = value;
    } else {
      this.selectedSearchTo = value;
    }
    this.onChange();
  }

  onChange() {
    const condition: boolean = this.isInRange()
      ? this.selectedSearch !== '' && this.selectedSearchTo !== ''
      : this.selectedSearch !== '';
    this.addOrRemoveFilter(condition, this);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedType = FuiDatagridNumberFilter.getDefaultType();
    this.defaultFilter = this.selectedType;
    if (!this.filterParams.inRangeInclusive) {
      this.filterParams.inRangeInclusive = true;
    }
    if (!this.filterParams.suppressAndOrCondition) {
      this.filterParams.suppressAndOrCondition = false;
    }
    if (!this.filterParams.defaultOption) {
      this.filterParams.defaultOption = this.selectedType;
    }

    if (this.getFilterService()) {
      const filter = this.getFilterService().getFilterFor(this.column);
      if (filter && filter instanceof FuiDatagridNumberFilter) {
        this.selectedSearch = filter.selectedSearch;
        this.selectedSearchTo = filter.selectedSearchTo;
        this.selectedType = filter.selectedType;
      }
    }
  }

  comparator(): Comparator<number> {
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

  static getDefaultType(): string {
    return FuiDatagridNumberFilter.EQUALS;
  }

  private translateNull(type: string): boolean {
    const reducedType: string =
      type.indexOf('greater') > -1 ? 'greaterThan' : type.indexOf('lessThan') > -1 ? 'lessThan' : 'equals';

    if (this.filterParams.nullComparator && (this.filterParams.nullComparator as NullComparator)[reducedType]) {
      return (this.filterParams.nullComparator as NullComparator)[reducedType];
    }

    return (FuiDatagridNumberFilter.DEFAULT_NULL_COMPARATOR as NullComparator)[reducedType];
  }

  private asNumber(value: any): number {
    return DatagridUtils.isNumeric(value) ? value : null;
  }

  private nullComparator(type: string): Comparator<number> {
    return (filterValue: number, gridValue: number): number => {
      if (gridValue === null) {
        const nullValue = this.translateNull(type);
        switch (this.selectedType) {
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
      const actualComparator: Comparator<number> = this.comparator();
      return actualComparator(filterValue, gridValue);
    };
  }
}
