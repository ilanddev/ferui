import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Injector, OnInit, SkipSelf } from '@angular/core';
import { AbstractPopover } from '../../../popover/common/abstract-popover';
import { FuiColumnService } from '../../services/rendering/column.service';
import { Column } from '../entities/column';
import { FuiDatagridClientSideRowModel } from '../row-models/client-side-row-model';
import { FuiDatagridFilterService } from '../../services/datagrid-filter.service';
import { FuiFormLayoutEnum } from '../../../forms/common/layout.enum';
import { FilterType } from './interfaces/filter.enum';
import { Point } from '../../../popover/common/popover-options.interface';

@Component({
  selector: 'fui-datagrid-filters-popover',
  template: `
    <div class="fui-datagrid-filters-popover-header">
      <div class="container-fluid">
        <div class="row">
          <div class="col-3 fui-dg-filters-column-name" unselectable="on">Columns</div>
          <div class="col">
            <fui-select
              fuiSelect
              name="fuiDatagridFilterColumns"
              [layout]="fuiFormLayoutEnum.SMALL"
              (ngModelChange)="onColumnChange($event)"
              [multiple]="true"
              [clearable]="false"
              appendTo=".fui-datagrid-filters-popover"
              [closeOnSelect]="true"
              [(ngModel)]="selectedColumns"
              placeholder="Select a column to filter"
            >
              <ng-option *ngFor="let column of columns" [value]="column">{{ column.name }}</ng-option>
            </fui-select>
          </div>
        </div>
      </div>
    </div>
    <div class="fui-datagrid-filters-popover-body" *ngIf="selectedColumns.length > 0">
      <div class="container-fluid">
        <div class="fui-datagrid-filter-row row" *ngFor="let column of selectedColumns">
          <fui-datagrid-date-filter
            *ngIf="column.filter === fuiFilterType.DATE"
            [column]="column"
            [filterParams]="column.filterParams"
          ></fui-datagrid-date-filter>

          <fui-datagrid-text-filter
            *ngIf="column.filter === fuiFilterType.STRING"
            [column]="column"
            [filterParams]="column.filterParams"
          ></fui-datagrid-text-filter>

          <fui-datagrid-boolean-filter
            *ngIf="column.filter === fuiFilterType.BOOLEAN"
            [column]="column"
            [filterParams]="column.filterParams"
          ></fui-datagrid-boolean-filter>

          <fui-datagrid-number-filter
            *ngIf="column.filter === fuiFilterType.NUMBER"
            [column]="column"
            [filterParams]="column.filterParams"
          ></fui-datagrid-number-filter>

          <ng-container
            *ngIf="column.filter === fuiFilterType.CUSTOM && column.filterFramework"
            [ngTemplateOutlet]="column.filterFramework"
            [ngTemplateOutletContext]="getContextFor(column)"
          ></ng-container>
        </div>
      </div>
    </div>
    <div class="fui-datagrid-filters-popover-footer container-fluid">
      <div class="row">
        <div class="col-auto">
          <button class="btn btn-clear" unselectable="on" *ngIf="hasActiveFilters()" (click)="clearCallback($event)">
            Clear all Filters
          </button>
        </div>
        <div class="col col-right">
          <button class="btn btn-cancel" unselectable="on" (click)="cancelCallback($event)">Cancel</button>
          <button class="btn btn-primary" unselectable="on" (click)="applyCallback($event)">Apply</button>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-filters-popover'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiDatagridFiltersPopover extends AbstractPopover implements OnInit {
  columns: Column[] = [];
  selectedColumns: Column[] = [];
  fuiFormLayoutEnum = FuiFormLayoutEnum;
  fuiFilterType = FilterType;

  constructor(
    @SkipSelf() parent: ElementRef,
    _injector: Injector,
    private cd: ChangeDetectorRef,
    private columnService: FuiColumnService,
    private clientSideRowModel: FuiDatagridClientSideRowModel,
    private filterService: FuiDatagridFilterService
  ) {
    super(_injector, parent, -10, 0);
    this.configurePopover();
  }

  ngOnInit(): void {
    this.columns = this.columnService.getFilteredColumns();
    this.selectedColumns = this.filterService.activeFilters.map(aFilter => {
      return aFilter.filter.getColumn();
    });
  }

  cancelCallback(event: MouseEvent | TouchEvent): void {
    this.ifOpenService.toggleWithEvent(event);
  }

  clearCallback(event: MouseEvent | TouchEvent): void {
    this.filterService.resetFilters();
    this.clientSideRowModel.doFilter();
    this.cancelCallback(event);
  }

  applyCallback(event: MouseEvent | TouchEvent): void {
    this.clientSideRowModel.doFilter();
    this.cancelCallback(event);
  }

  hasActiveFilters(): boolean {
    return this.filterService.hasActiveFilters();
  }

  getContextFor(column: Column) {
    return {
      column: column,
      filterParams: column.filterParams
    };
  }

  onColumnChange(columns: Column[]): void {
    // When we remove a filtered column, we need to remove the filter as well.
    this.filterService.activeFilters.forEach(aFilter => {
      const filterExistIndex = columns.findIndex(col => col.getColId() === aFilter.index);
      if (filterExistIndex < 0) {
        this.filterService.removeFilter(aFilter.filter);
      }
    });
  }

  /**
   * Configure Popover Direction and Close indicators
   */
  private configurePopover(): void {
    this.anchorPoint = Point.BOTTOM_LEFT;
    this.popoverPoint = Point.LEFT_TOP;
    this.closeOnOutsideClick = false;
  }
}
