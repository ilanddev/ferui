import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IfOpenService } from '../../../utils/conditional/if-open.service';
import { Subscription } from 'rxjs';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridFilterService } from '../../services/datagrid-filter.service';
import { Column } from '../entities/column';

@Component({
  selector: 'fui-datagrid-search-filter-button',
  template: `
    <div class="fui-datagrid-filters-popover-wrapper" [class.with-filter]="hasFilters()">
      <fui-datagrid-global-search-filter [columns]="columns"></fui-datagrid-global-search-filter>

      <button
        *ngIf="hasFilters()"
        class="fui-datagrid-filters-button"
        [class.has-active-filters]="hasActiveFilters()"
        [class.is-open]="isOpenPopup"
        (click)="toggleFilters($event)"
      >
        <span class="fui-datagrid-filter-label" unselectable="on">{{ getFilterText() }}</span>
        <clr-icon shape="fui-filter" class="fui-datagrid-filter-icon" [class.has-badge]="hasActiveFilters()"></clr-icon>
      </button>
      <fui-datagrid-filters-popover *fuiIfOpen></fui-datagrid-filters-popover>
    </div>
  `,
  providers: [IfOpenService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'fui-datagrid-search-filter-button',
  },
})
export class FuiDatagridSearchFilterButton implements OnDestroy, OnInit {
  isOpenPopup: boolean = false;
  columns: Column[];

  private subscriptions: Subscription[] = [];

  constructor(
    private ifOpenService: IfOpenService,
    private cd: ChangeDetectorRef,
    private columnService: FuiColumnService,
    private filterService: FuiDatagridFilterService
  ) {
    this.subscriptions.push(
      ifOpenService.openChange.subscribe(isOpen => {
        this.isOpenPopup = isOpen;
        this.cd.markForCheck();
      })
    );
  }

  ngOnInit(): void {
    if (this.columnService) {
      this.columns = this.columnService.getFilteredColumns();
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }

  /**
   * Toggles the filters Popover.
   */
  toggleFilters(event: MouseEvent) {
    this.ifOpenService.toggleWithEvent(event);
  }

  hasFilters(): boolean {
    return this.columnService.hasFilters();
  }

  hasActiveFilters(): boolean {
    return this.filterService.hasActiveFilters();
  }

  getFilterText(): string {
    if (this.filterService.hasActiveFilters()) {
      return `${this.filterService.activeFilters.length} Filters`;
    } else {
      return 'Filters';
    }
  }
}
