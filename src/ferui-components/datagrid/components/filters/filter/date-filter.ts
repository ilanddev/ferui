import { Component, OnInit } from '@angular/core';
import { FuiDatagridBaseFilter } from './base-filter';
import { Comparator, FuiDatagridIFilter, IDateFilterParams, IDoesFilterPassParams, NullComparator } from '../interfaces/filter';
import { FuiDatetimeModelTypes } from '../../../../forms/common/datetime-model-types.enum';
import { DateIOService } from '../../../../forms/date/providers/date-io.service';
import { LocaleHelperService } from '../../../../forms/datepicker/providers/locale-helper.service';
import { FilterType } from '../interfaces/filter.enum';
import { isArray } from 'util';

@Component({
  selector: 'fui-datagrid-date-filter',
  template: `
    <div class="row">
      <div class="col-3 fui-dg-filters-column-name" unselectable="on">
        {{ getColumnName() }}
      </div>
      <div [class.col-3]="isInRange()" [class.col-5]="!isInRange()">
        <fui-select-container>
          <label></label>
          <fui-select
            fuiSelect
            name="fuiDatagridDateFilterType"
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
      <div [class.col-3]="isInRange()" [class.col-4]="!isInRange()">
        <fui-date-container [appendTo]="'.fui-datagrid-filters-popover'">
          <label>{{ isInRange() ? translate('filterBetween') : translate('filterOoo') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            name="fuiDatagridDateFilterSearch"
            [fuiDate]="modelTypeDate"
            (ngModelChange)="onFilterInputChanged($event, 'search')"
            [(ngModel)]="selectedSearch"
          />
        </fui-date-container>
      </div>
      <div class="col-3" *ngIf="isInRange()">
        <fui-date-container [appendTo]="'.fui-datagrid-filters-popover'">
          <label>{{ translate('filterAnd') }}</label>
          <input
            [layout]="fuiFormLayoutEnum.SMALL"
            name="fuiDatagridDateFilterSearchTo"
            [fuiDate]="modelTypeDate"
            (ngModelChange)="onFilterInputChanged($event, 'searchTo')"
            [(ngModel)]="selectedSearchTo"
          />
        </fui-date-container>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-date-filter container-fluid'
  },
  providers: [LocaleHelperService, DateIOService]
})
export class FuiDatagridDateFilter extends FuiDatagridBaseFilter<IDateFilterParams> implements OnInit {
  static readonly DEFAULT_NULL_COMPARATOR: NullComparator = {
    equals: false,
    lessThan: false,
    greaterThan: false
  };

  modelTypeDate = FuiDatetimeModelTypes.DATE;

  selectedType: string;
  selectedSearch: Date;
  selectedSearchTo: Date;

  constructor(private dateIOService: DateIOService) {
    super();
  }

  getApplicableFilterTypes(): string[] {
    return [
      FuiDatagridDateFilter.EQUALS,
      FuiDatagridDateFilter.NOT_EQUAL,
      FuiDatagridDateFilter.LESS_THAN,
      FuiDatagridDateFilter.GREATER_THAN,
      FuiDatagridDateFilter.IN_RANGE
    ];
  }

  isInRange(): boolean {
    return this.selectedType === FuiDatagridDateFilter.IN_RANGE;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const cellValue: any = params.data;
    const rawFilterValues: Date[] | Date = this.filterValues();
    const filterValue: Date = Array.isArray(rawFilterValues) ? rawFilterValues[0] : rawFilterValues;

    const comparator: Comparator<Date> = this.nullComparator(this.selectedType as string);
    const compareResult = comparator(filterValue, cellValue);

    switch (this.selectedType) {
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
    return FilterType.DATE;
  }

  getFilterOption(): string {
    return this.selectedType;
  }

  getFilterValue(): any {
    return this.filterValues();
  }

  filterValues(): Date | Date[] {
    if (!this.selectedSearch) {
      return null;
    }
    return this.selectedType !== FuiDatagridDateFilter.IN_RANGE
      ? this.selectedSearch
      : [this.selectedSearch, this.selectedSearchTo];
  }

  onFilterTypeChanged(value: string) {
    this.selectedType = value;
    this.onChange();
  }

  onFilterInputChanged(value: Date, type: string) {
    if (type === 'search') {
      this.selectedSearch = value;
    } else {
      this.selectedSearchTo = value;
    }
    this.onChange();
  }

  onChange() {
    const condition: boolean = this.isInRange() ? !!this.selectedSearch && !!this.selectedSearchTo : !!this.selectedSearch;
    const filter: FuiDatagridIFilter = {
      isFilterActive: () => this.isFilterActive(),
      setFilterActive: (val: boolean) => this.setFilterActive(val),
      doesFilterPass: (params: IDoesFilterPassParams) => this.doesFilterPass(params),
      addOrRemoveFilter: (cond: boolean, fil: FuiDatagridIFilter) => this.addOrRemoveFilter(cond, fil),
      getColumn: () => this.getColumn(),
      getFilterType: () => this.getFilterType(),
      getFilterOption: () => this.getFilterOption(),
      getFilterValue: () => this.getFilterValue(),
      getFilterParams: () => this.getFilterParams()
    };
    this.addOrRemoveFilter(condition, filter);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedType = FuiDatagridDateFilter.getDefaultType();
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
    if (!this.filterParams.dateFormat) {
      this.filterParams.dateFormat = 'yyyy-mm-dd';
    }

    if (this.getFilterService()) {
      const filter: FuiDatagridIFilter = this.getFilterService().getFilterFor(this.column);
      if (filter) {
        if (isArray(filter.getFilterValue())) {
          this.selectedSearch = filter.getFilterValue()[0];
          this.selectedSearchTo = filter.getFilterValue()[1];
        } else {
          this.selectedSearch = filter.getFilterValue();
        }
        this.selectedType = filter.getFilterOption();
      }
    }
  }

  comparator(): Comparator<Date> {
    return this.filterParams.comparator ? this.filterParams.comparator : this.defaultComparator.bind(this);
  }

  static getDefaultType(): string {
    return FuiDatagridDateFilter.EQUALS;
  }

  private defaultComparator(filterDate: Date, cellValue: any): number {
    //The default comparator assumes that the cellValue is a date
    const cellAsDate: Date =
      cellValue instanceof Date
        ? cellValue
        : this.dateIOService.getDateValueFromDateOrString(
            this.dateIOService.convertDateStringToLocalString(cellValue, this.filterParams.dateFormat)
          );

    if (cellAsDate < filterDate) {
      return -1;
    }
    if (cellAsDate > filterDate) {
      return 1;
    }
    return cellValue !== null ? 0 : -1;
  }

  private translateNull(type: string): boolean {
    const reducedType: string =
      type.indexOf('greater') > -1 ? 'greaterThan' : type.indexOf('lessThan') > -1 ? 'lessThan' : 'equals';

    if (this.filterParams.nullComparator && (this.filterParams.nullComparator as NullComparator)[reducedType]) {
      return (this.filterParams.nullComparator as NullComparator)[reducedType];
    }

    return (FuiDatagridDateFilter.DEFAULT_NULL_COMPARATOR as NullComparator)[reducedType];
  }

  private nullComparator(type: string): Comparator<Date> {
    return (filterValue: Date, gridValue: Date): number => {
      if (gridValue === null) {
        const nullValue = this.translateNull(type);
        switch (this.selectedType) {
          case FuiDatagridDateFilter.EMPTY:
            return 0;
          case FuiDatagridDateFilter.EQUALS:
            return nullValue ? 0 : 1;
          case FuiDatagridDateFilter.GREATER_THAN:
            return nullValue ? 1 : -1;
          case FuiDatagridDateFilter.LESS_THAN:
            return nullValue ? -1 : 1;
          case FuiDatagridDateFilter.NOT_EQUAL:
            return nullValue ? 1 : 0;
          default:
            break;
        }
      }
      const actualComparator: Comparator<Date> = this.comparator();
      return actualComparator(filterValue, gridValue);
    };
  }
}
