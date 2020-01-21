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
  Self,
  TemplateRef
} from '@angular/core';
import { FuiBodyCell } from './body-cell';
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { Column } from '../entities/column';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridEvents, RowClickedEvent, RowDoubleClickedEvent } from '../../events';
import { Subscription } from 'rxjs';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';
import { FuiActionMenuService } from '../../services/action-menu/action-menu.service';

@Component({
  selector: 'fui-datagrid-body-row',
  template: `
    <ng-content *ngIf="!isRowError()" select="fui-datagrid-body-cell"></ng-content>
    <div *ngIf="isRowError()">{{ data.fuiError }}</div>
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
  @HostBinding('style.height.px') rowHeight: number = 0;

  @Input() datagridId: string;
  @Input() data: any;
  @Input() actionMenuTemplate: TemplateRef<FuiDatagridBodyRowContext>;

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
  private mouseLeaveTimeout: NodeJS.Timer;
  private rowHovered: boolean = false;

  constructor(
    @Self() private el: ElementRef,
    private actionMenuService: FuiActionMenuService,
    private cd: ChangeDetectorRef,
    private rowRendererService: RowRendererService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService,
    private eventService: FuiDatagridEventService
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
  onRowEnter() {
    this.actionMenuService.setSelectedRowContext(this.getContextForActionMenu());
    this.actionMenuService.isActionMenuVisible = true;
    this.isRowOrActionMenuHovered = true;
    this.rowHovered = true;
    this.cd.markForCheck();
  }

  @HostListener('mouseleave')
  onRowLeave() {
    this.rowHovered = false;
    this.mouseLeaveTimeout = setTimeout(() => {
      const context: FuiDatagridBodyRowContext = this.actionMenuService.curentlySelectedRowContext || null;
      if (!this.actionMenuService.isActionMenuHovered && context && context.rowIndex === this.rowIndex) {
        this.actionMenuService.isActionMenuVisible = false;
      }
      if (!this.actionMenuService.isActionMenuHovered) {
        this.isRowOrActionMenuHovered = false;
        this.cd.markForCheck();
      }
    }, 10);
  }

  ngOnInit(): void {
    if (this.optionsWrapperService && this.optionsWrapperService.gridOptions) {
      this.rowHeight = this.optionsWrapperService.gridOptions.rowHeight;
      this.cd.markForCheck();
    }

    this.subscriptions.push(
      this.actionMenuService.actionMenuHoverChange().subscribe(isHovered => {
        const context = this.actionMenuService.curentlySelectedRowContext || null;
        this.isRowOrActionMenuHovered = context && context.rowIndex === this.rowIndex && isHovered;
        this.cd.markForCheck();
        if (!isHovered) {
          setTimeout(() => {
            if (!this.rowHovered && context && context.rowIndex === this.rowIndex && !isHovered) {
              this.actionMenuService.isActionMenuVisible = false;
            }
          }, 10);
        }
      }),
      this.actionMenuService.actionMenuOpenChange().subscribe(isOpen => {
        const context = this.actionMenuService.curentlySelectedRowContext || null;
        this.isRowSelected = context && context.rowIndex === this.rowIndex && isOpen;
        this.cd.markForCheck();
      })
    );
  }

  ngOnDestroy(): void {
    if (this.mouseLeaveTimeout) {
      clearTimeout(this.mouseLeaveTimeout);
    }
    this.rowRendererService.removeRowElement(this.rowIndex);
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = null;
    const context = this.actionMenuService.curentlySelectedRowContext || null;
    if (
      context &&
      context.rowIndex === this.rowIndex &&
      this.actionMenuService.isActionMenuVisible &&
      this.actionMenuService.isActionMenuDropdownOpen
    ) {
      this.actionMenuService.isActionMenuVisible = false;
      this.actionMenuService.isActionMenuDropdownOpen = false;
    }
  }

  getCellForCol(column: Column): FuiBodyCell {
    return this.cells.find(cell => cell.column.getColId() === column.getColId());
  }

  isRowError(): boolean {
    return this.data && this.data.hasOwnProperty('fuiError') && this.data.fuiError;
  }

  private getContextForActionMenu(): FuiDatagridBodyRowContext {
    return {
      rowHeight: this.rowHeight,
      rowIndex: this.rowIndex,
      rowData: this.data,
      rowTopValue: this.el.nativeElement.offsetTop,
      isFirstRow: this.isFirstRow,
      appendTo: '#' + this.datagridId
    };
  }
}
