import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Self
} from '@angular/core';
import { FuiBodyCell } from './body-cell';
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { Column } from '../entities/column';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridEvents, RowClickedEvent, RowDoubleClickedEvent } from '../../events';
import { Subscription } from 'rxjs';
import { FuiActionMenuService } from '../../services/action-menu/action-menu.service';
import { FuiActionMenuUtils } from '../../services/action-menu/action-menu-utils';

@Component({
  selector: 'fui-datagrid-body-row',
  template: `
    <ng-content *ngIf="!isRowError()" select="fui-datagrid-body-cell"></ng-content>
    <div *ngIf="isRowError()" class="fui-datagrid-row-error" [style.height.px]="rowHeight" [style.line-height.px]="rowHeight - 2">
      <clr-icon shape="fui-error" class="fui-datagrid-row-error-icon"></clr-icon>
      <span class="fui-error-message">{{ data.fuiError }}</span>
    </div>
  `,
  host: {
    '[class.fui-datagrid-body-row]': 'true',
    '[class.selectable]': 'true',
    '[class.selected]': 'isRowSelected',
    '[class.hovered]': 'isRowOrActionMenuHovered'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiBodyRow implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'row';

  @HostBinding('style.height.px')
  @Input()
  rowHeight: number = 0;

  @Input() datagridId: string;
  @Input() data: any;
  @Input() hasActionMenu: boolean;

  get isFirstRow(): boolean {
    return this._isFirstRow;
  }

  @HostBinding('class.fui-datagrid-first-row')
  set isFirstRow(value: boolean) {
    this._isFirstRow = value;
    this.cd.markForCheck();
  }

  @Input('rowIndex')
  set rowIndex(index) {
    this._rowIndex = index;
    this.cd.markForCheck();
    this.isFirstRow = this._rowIndex === 0;
    if (this.rowRendererService) {
      this.rowRendererService.storeRowElement(this.rowIndex, this);
    }
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  @ContentChildren(FuiBodyCell) cells: QueryList<FuiBodyCell>;

  isRowSelected: boolean = false;
  isRowOrActionMenuHovered: boolean = false;

  private _isFirstRow: boolean = false;
  private _rowIndex: number = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    @Self() public elementRef: ElementRef,
    private cd: ChangeDetectorRef,
    private rowRendererService: RowRendererService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    private eventService: FuiDatagridEventService,
    private actionMenuService: FuiActionMenuService
  ) {}

  @HostListener('click', ['$event'])
  onRowClick(event) {
    const evt: RowClickedEvent = {
      rowNode: this,
      rowData: this.data,
      rowIndex: this.rowIndex,
      event: event,
      type: FuiDatagridEvents.EVENT_ROW_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('dblclick', ['$event'])
  onRowDblClick(event) {
    const evt: RowDoubleClickedEvent = {
      rowNode: this,
      rowData: this.data,
      rowIndex: this.rowIndex,
      event: event,
      type: FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED
    };
    this.eventService.dispatchEvent(evt);
  }

  @HostListener('mouseenter')
  onRowHovered() {
    if (this.hasActionMenu) {
      this.actionMenuService.setSelectedRowContext(FuiActionMenuUtils.getContextForActionMenu(this));
      this.actionMenuService.isActionMenuVisible = true;
    }
  }

  ngOnInit(): void {
    if (this.hasActionMenu) {
      this.subscriptions.push(
        this.actionMenuService.actionMenuVisibilityChange().subscribe(isVisible => {
          const context = this.actionMenuService.currentlySelectedRowContext || null;
          if (context) {
            this.isRowOrActionMenuHovered = this.rowIndex === context.rowIndex && isVisible;
          } else {
            this.isRowOrActionMenuHovered = false;
          }
          this.cd.markForCheck();
        }),
        this.actionMenuService.actionMenuOpenChange().subscribe(isOpen => {
          const isVisible: boolean = this.actionMenuService.isActionMenuVisible;
          const context = this.actionMenuService.currentlySelectedRowContext || null;
          if (context) {
            this.isRowOrActionMenuHovered = this.rowIndex === context.rowIndex && (isOpen || isVisible);
          } else {
            this.isRowOrActionMenuHovered = false;
          }
          this.cd.markForCheck();
        }),
        this.actionMenuService.actionMenuHoverChange().subscribe(isHovered => {
          const isOpen: boolean = this.actionMenuService.isActionMenuDropdownOpen;
          const isVisible: boolean = this.actionMenuService.isActionMenuVisible;
          const context = this.actionMenuService.currentlySelectedRowContext || null;
          if (context) {
            this.isRowOrActionMenuHovered = this.rowIndex === context.rowIndex && (isHovered || isOpen || isVisible);
          } else {
            this.isRowOrActionMenuHovered = false;
          }
          this.cd.markForCheck();
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.rowRendererService.removeRowElement(this.rowIndex);
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = null;
  }

  getCellForCol(column: Column): FuiBodyCell {
    return this.cells.find(cell => cell.column.getColId() === column.getColId());
  }

  isRowError(): boolean {
    return this.data && this.data.hasOwnProperty('fuiError') && this.data.fuiError;
  }
}
