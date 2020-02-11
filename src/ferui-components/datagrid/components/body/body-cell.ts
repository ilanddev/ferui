import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Self,
  TemplateRef
} from '@angular/core';
import { Column } from '../entities/column';
import { Subscription } from 'rxjs';
import { CellClickedEvent, CellContextMenuEvent, CellDoubleClickedEvent, ColumnEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridBodyCellContext } from '../../types/body-cell-context';
import { FuiDatagridBodyDropTarget } from '../entities/body-drop-target';

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
    '[class.moving]': 'column.isMoving()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiBodyCell extends FuiDatagridBodyDropTarget implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'gridcell';
  @HostBinding('attr.tabindex') tabindex: string = '-1';

  @HostBinding('style.width.px') width: number = 0;
  @HostBinding('style.min-width.px') minWidth: number = 0;
  @HostBinding('style.max-width.px') maxWidth: number = null;
  @HostBinding('style.line-height.px') lineHeight: number = null;

  @Input() column: Column;
  @Input() rowHeight: number;
  @Input() rowData: any;
  @Input() rowIndex: number;

  cellTemplate: TemplateRef<FuiDatagridBodyCellContext>;
  templateContext: FuiDatagridBodyCellContext;

  private element: HTMLElement;
  private subscriptions: Subscription[] = [];

  private _left: number = 0;

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

  @HostBinding('style.left.px')
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    if (this._left !== value) {
      this._left = value;
      this.cd.markForCheck();
    }
  }

  @HostListener('click', ['$event'])
  onCellClick(event) {
    const evt: CellClickedEvent = {
      cellNode: this,
      column: this.column,
      value: this.templateContext.value,
      rowIndex: this.rowIndex,
      rowData: this.rowData,
      event: event,
      type: FuiDatagridEvents.EVENT_CELL_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('dblclick', ['$event'])
  onCellDblClick(event) {
    const evt: CellDoubleClickedEvent = {
      cellNode: this,
      column: this.column,
      value: this.templateContext.value,
      rowIndex: this.rowIndex,
      rowData: this.rowData,
      event: event,
      type: FuiDatagridEvents.EVENT_CELL_DOUBLE_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('contextmenu', ['$event'])
  onCellContextMenu(event) {
    const evt: CellContextMenuEvent = {
      cellNode: this,
      column: this.column,
      value: this.templateContext.value,
      rowIndex: this.rowIndex,
      rowData: this.rowData,
      event: event,
      type: FuiDatagridEvents.EVENT_CELL_CONTEXT_MENU
    };
    this.eventService.dispatchEvent(evt);
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
      value: this.rowData ? this.rowData[this.column.getColumnDefinition().field] : null,
      column: this.column,
      row: this.rowData
    };
    this.cd.markForCheck();

    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.width = ev.column.getActualWidth();
          this.cd.markForCheck();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.left = ev.column.getLeft();
          this.cd.markForCheck();
        }
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }
}
