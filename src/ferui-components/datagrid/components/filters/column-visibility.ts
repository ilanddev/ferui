import { Component, ElementRef, OnDestroy, OnInit, Self } from '@angular/core';
import { Column } from '../entities/column';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridEvents } from '../../events';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fui-datagrid-filter-column-visibility',
  template: `
    <fui-select-container>
      <clr-icon class="fui-column-visibility" shape="fui-columns" fuiSelectIcon></clr-icon>
      <fui-select
        fuiSelect
        name="columnsVisibility"
        [items]="columns"
        bindLabel="name"
        [multiple]="true"
        (add)="columnVisibilityChange($event, 'add')"
        (remove)="columnVisibilityChange($event, 'remove')"
        [closeOnSelect]="false"
        [(ngModel)]="visibleColumns"
      >
      </fui-select>
    </fui-select-container>
  `
})
export class FuiDatagridFilterColumnVisibility implements OnInit, OnDestroy {
  columns: Object[] = [];
  visibleColumns: Object[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    @Self() public elementRef: ElementRef,
    private columnService: FuiColumnService,
    private eventService: FuiDatagridEventService
  ) {}

  ngOnInit(): void {
    if (this.columnService) {
      this.columns = [...this.columnService.getAllDisplayedColumns()].map(col => col.toJson());
      this.visibleColumns = [...this.columnService.getVisibleColumns()].map(col => col.toJson());
      this.subscriptions.push(
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_VISIBLE_CHANGED).subscribe(() => {
          this.visibleColumns = [...this.columnService.getVisibleColumns()].map(col => col.toJson());
        }),
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_COLUMN_MOVED).subscribe(event => {
          this.columns = [...this.columnService.getAllDisplayedColumns()].map(col => col.toJson());
          this.visibleColumns = [...this.columnService.getVisibleColumns()].map(col => col.toJson());
        })
      );
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  columnVisibilityChange(event, source: string) {
    const colId = source === 'remove' ? event.value.id : event.id;
    const visibility = source === 'add';

    const col: Column = this.columnService.getAllDisplayedColumns().find(c => {
      return c.getColId() === colId;
    });
    if (col) {
      this.columnService.changeColumnVisibility(col, visibility);
    }
  }
}
