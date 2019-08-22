import { Component, Input, OnInit } from '@angular/core';
import { FuiDatagridBaseFilter } from './base-filter';
import { FuiDatagridIGlobalSearchFilter, IDoesGlobalFilterPassParams, IGlobalFilterParams } from '../interfaces/filter';
import { FuiDatagridFilterService } from '../../../services/datagrid-filter.service';
import { FuiDatagridTextFilter, TextComparator, TextFormatter } from './text-filter';
import { Column } from '../../entities/column';
import { FilterType } from '../interfaces/filter.enum';
import { FuiDatagridClientSideRowModel } from '../../row-models/client-side-row-model';

@Component({
  selector: 'fui-datagrid-global-search-filter',
  template: `
    <input
      placeholder="Global search"
      type="search"
      name="datagridSearch"
      [(ngModel)]="selectedSearch"
      (ngModelChange)="onFilterInputChanged($event)"
    />
    <clr-icon class="fui-datagrid-search-icon" shape="fui-search"></clr-icon>
  `,
  host: {
    class: 'fui-datagrid-filters-search',
  },
})
export class FuiDatagridGlobalSearchFilter implements FuiDatagridIGlobalSearchFilter, OnInit {
  @Input() columns: Column[];
  @Input() filterParams: IGlobalFilterParams;

  selectedType: string;
  selectedSearch: string = '';

  protected defaultParams: IGlobalFilterParams = {
    columns: this.getColumns(),
    rowData: null,
  };
  protected _isActive: boolean;
  private comparator: TextComparator;
  private formatter: TextFormatter;

  constructor(
    private filterService: FuiDatagridFilterService,
    private clientSideRowModel: FuiDatagridClientSideRowModel
  ) {}

  doesFilterPass(params: IDoesGlobalFilterPassParams): boolean {
    const rowData: any = params.rowData;
    let pass: boolean = false;
    if (this.getColumns().length > 0 && rowData) {
      this.getColumns().forEach(column => {
        if (this.formatter(rowData[column.getColId()]) !== null) {
          const filterPass: boolean = this.comparator(
            this.selectedType,
            this.formatter(rowData[column.getColId()]),
            this.formatter(this.selectedSearch)
          );
          if (filterPass === true) {
            pass = true;
          }
        }
      });
    }
    return pass;
  }

  getFilterType(): FilterType {
    return FilterType.GLOBAL_SEARCH;
  }

  setFilterActive(value: boolean): void {
    this._isActive = value;
  }

  //This is used to let the grid know if the filter is active or not
  isFilterActive(): boolean {
    return this._isActive;
  }

  getColumns(): Column[] {
    return this.columns;
  }

  // This method should be called every-time the user do a change with the filter.
  // This will update the saved filter or remove it if the user remove the filter.
  addOrRemoveFilter(condition: boolean, filter: FuiDatagridIGlobalSearchFilter): void {
    if (this.filterService) {
      if (condition) {
        filter.setFilterActive(true);
        this.filterService.addGlobalSearchFilter(filter);
      } else {
        filter.setFilterActive(false);
        this.filterService.removeGlobalSearchFilter();
      }
      this.clientSideRowModel.doFilter();
    }
  }

  ngOnInit(): void {
    this.selectedType = FuiDatagridBaseFilter.CONTAINS;
    if (!this.filterParams) {
      this.filterParams = this.defaultParams;
    }
    if (!this.filterParams.caseSensitive) {
      this.filterParams.caseSensitive = false;
    }
    if (!this.filterParams.defaultOption) {
      this.filterParams.defaultOption = this.selectedType;
    } else {
      this.selectedType = this.filterParams.defaultOption;
    }

    this.comparator = this.filterParams.textCustomComparator
      ? this.filterParams.textCustomComparator
      : FuiDatagridTextFilter.DEFAULT_COMPARATOR;
    this.formatter = this.filterParams.textFormatter
      ? this.filterParams.textFormatter
      : this.filterParams.caseSensitive === true
      ? FuiDatagridTextFilter.DEFAULT_FORMATTER
      : FuiDatagridTextFilter.DEFAULT_LOWERCASE_FORMATTER;
  }

  onFilterInputChanged(value: string) {
    this.selectedSearch = value;
    this.addOrRemoveFilter(this.selectedSearch !== '', this);
  }
}
