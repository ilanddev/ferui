import { Injectable } from '@angular/core';
import {
  FuiDatagridActiveGlobalFilter,
  FuiDatagridIFilter,
  FuiDatagridIGlobalSearchFilter,
  IDoesGlobalFilterPassParams
} from '../components/filters/interfaces/filter';
import { Column } from '../components/entities/column';
import { Observable, Subject } from 'rxjs';

export interface FuiDatagridActiveFilter {
  index: string;
  filter: FuiDatagridIFilter;
}

export const DATAGRID_GLOBAL_SEARCH_ID: string = 'globalSearch';

@Injectable()
export class FuiDatagridFilterService {
  private filters$: Subject<Array<FuiDatagridActiveFilter | FuiDatagridActiveGlobalFilter>> = new Subject<
    Array<FuiDatagridActiveFilter | FuiDatagridActiveGlobalFilter>
  >();
  private _activeFilters: FuiDatagridActiveFilter[] = [];
  private _globalSearchFilter: FuiDatagridActiveGlobalFilter;
  private _rowData: any[] = [];
  private _filteredData: any[] = [];

  constructor() {}

  get activeFilters(): FuiDatagridActiveFilter[] {
    return this._activeFilters;
  }

  set activeFilters(value: FuiDatagridActiveFilter[]) {
    this._activeFilters = value;
  }

  get globalSearchFilter(): FuiDatagridActiveGlobalFilter {
    return this._globalSearchFilter;
  }

  set globalSearchFilter(value: FuiDatagridActiveGlobalFilter) {
    this._globalSearchFilter = value;
  }

  get rowData(): any[] {
    return this._rowData;
  }

  set rowData(value: any[]) {
    this._rowData = value;
  }

  get filteredData(): any[] {
    return this._filteredData;
  }

  set filteredData(value: any[]) {
    this._filteredData = value;
  }

  addGlobalSearchFilter(filter: FuiDatagridIGlobalSearchFilter): void {
    if (filter) {
      this.globalSearchFilter = {
        index: DATAGRID_GLOBAL_SEARCH_ID,
        filter: filter
      };
    }
  }

  removeGlobalSearchFilter(): void {
    if (this.globalSearchFilter && this.globalSearchFilter.filter !== null) {
      this.globalSearchFilter = {
        index: DATAGRID_GLOBAL_SEARCH_ID,
        filter: null
      };
    }
  }

  addFilter(filter: FuiDatagridIFilter): void {
    if (filter && filter.getColumn instanceof Function) {
      const id = filter.getColumn().getColId();
      const filterIndex: number = this.activeFilters.findIndex(f => f.index === id);
      // If the filter is already present in the active filters list, we just update its values.
      if (filterIndex > -1) {
        this._activeFilters[filterIndex].filter = filter;
      } else {
        this._activeFilters.push({ index: id, filter: filter });
      }
      this.filters$.next([...this._activeFilters, this.globalSearchFilter]);
    }
  }

  removeFilter(filter: FuiDatagridIFilter): void {
    if (filter) {
      const id = filter.getColumn().getColId();
      const filterIndex: number = this.activeFilters.findIndex(f => f.index === id);
      if (filterIndex > -1) {
        this._activeFilters.splice(filterIndex, 1);
      }
      this.filters$.next([...this._activeFilters, this.globalSearchFilter]);
    }
  }

  getFilterFor(column: Column): FuiDatagridIFilter | null {
    if (this.activeFilters.length > 0) {
      const activeFilter = this.activeFilters.find(aFilter => {
        return aFilter.index === column.getColId();
      });
      return activeFilter ? activeFilter.filter : null;
    }
  }

  hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }

  hasGlobalSearchFilter(): boolean {
    return this.globalSearchFilter && this.globalSearchFilter.filter !== null;
  }

  resetFilters(): void {
    this.globalSearchFilter = null;
    this.activeFilters = [];
    this.filters$.next([]);
  }

  filter(): void {
    if (!this.hasActiveFilters() && !this.hasGlobalSearchFilter) {
      this.filteredData = this.rowData;
    } else {
      const filteredData = [];
      let doesFiltersPass: boolean = true;
      let added: boolean = false;
      let globalSearchPass: boolean = false;
      const condition: string = 'and';
      this.rowData.forEach(data => {
        added = false;
        doesFiltersPass = true;

        if (this.hasActiveFilters()) {
          for (const aFilter of this.activeFilters) {
            const filter: FuiDatagridIFilter = aFilter.filter;
            const doesFilterPass: boolean = filter.doesFilterPass({ data: data[filter.getColumn().getColId()] });
            if (condition === 'and' && !doesFilterPass) {
              doesFiltersPass = false;
              break;
            } else if (condition === 'or' && !added && doesFilterPass) {
              filteredData.push(data);
              added = true;
              break;
            }
          }
        }

        if (this.hasGlobalSearchFilter()) {
          const filter: FuiDatagridIGlobalSearchFilter = this.globalSearchFilter.filter;
          const doesPassParams: IDoesGlobalFilterPassParams = {
            rowData: data,
            data: null
          };
          globalSearchPass = filter.doesFilterPass(doesPassParams);
          if (
            (condition === 'or' && globalSearchPass && !added) ||
            (condition === 'and' && globalSearchPass && doesFiltersPass)
          ) {
            added = true;
            filteredData.push(data);
          }
        } else if (condition === 'and' && doesFiltersPass) {
          filteredData.push(data);
        }
      });
      this.filteredData = filteredData;
    }
  }

  filtersSub(): Observable<Array<FuiDatagridActiveFilter | FuiDatagridActiveGlobalFilter>> {
    return this.filters$.asObservable();
  }
}
