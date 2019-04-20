import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Self,
  TemplateRef,
} from '@angular/core';
import { Column } from '../entities/column';
import { Subscription } from 'rxjs';
import { ColumnEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridBodyDropTarget } from '../entities/body-drop-target';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridBodyCellContext } from '../../types/body-cell-context';
import { FuiColumnDefinitions } from '../../types/column-definitions';

@Component({
  selector: 'fui-datagrid-body-cell',
  template: `
    <ng-container
      [ngTemplateOutlet]="cellTemplate ? cellTemplate : defaultCellRenderer"
      [ngTemplateOutletContext]="templateContext"
    ></ng-container>
    <ng-template #defaultCellRenderer let-value="value">{{ value }}</ng-template>
  `,
  host: {
    '[class.fui-datagrid-body-cell]': 'true',
    '[class.fui-datagrid-column-visible]': 'column.isVisible()',
    '[class.with-animation]': 'true',
    '[class.moving]': 'column.isMoving()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiBodyCell extends FuiDatagridBodyDropTarget implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'gridcell';
  @HostBinding('attr.tabindex') tabindex: string = '-1';
  @HostBinding('style.width.px') width: number = 0;
  @HostBinding('style.min-width.px') minWidth: number = 0;
  @HostBinding('style.max-width.px') maxWidth: number = null;
  @HostBinding('style.left.px') left: number = 0;
  @HostBinding('style.line-height.px') lineHeight: number = null;

  @Input() columnDefinition: FuiColumnDefinitions;
  @Input() columns: Array<Column>;
  @Input() column: Column;
  @Input() rowHeight: number;
  @Input() rowDef: any;
  @Input() rowIndex: number;
  @Input() colId: string;

  cellTemplate: TemplateRef<any>;
  templateContext: FuiDatagridBodyCellContext;

  private element: HTMLElement;
  private subscriptions: Subscription[] = [];

  constructor(
    @Self() public elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private eventService: FuiDatagridEventService,
    dragAndDropService: FuiDatagridDragAndDropService,
    columnService: FuiColumnService,
    gridPanel: FuiDatagridService
  ) {
    super(gridPanel.eBodyViewport, dragAndDropService, columnService, gridPanel);
    this.element = elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.left = this.column.getLeft();
    this.width = this.column.getActualWidth();
    this.minWidth = this.column.getMinWidth();
    this.maxWidth = this.column.getMaxWidth();

    if (this.rowHeight) {
      this.lineHeight = this.rowHeight - 1;
    }

    if (this.column.getRendererTemplate()) {
      this.cellTemplate = this.column.getRendererTemplate();
    }

    this.templateContext = {
      value: this.rowDef ? this.rowDef[this.column.getColumnDefinition().field] : null,
      column: this.column,
      row: this.rowDef,
    };
    this.cd.markForCheck();

    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev) {
          if (ev.column.getColId() === this.column.getColId()) {
            this.width = ev.column.getActualWidth();
            this.cd.markForCheck();
          }
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev) {
          if (ev.column.getColId() === this.column.getColId()) {
            this.left = ev.column.getLeft();
            this.cd.markForCheck();
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 1) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }
}
