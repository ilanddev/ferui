import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
} from '@angular/core';
import { FuiBodyCell } from './body-cell';
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { Column } from '../entities/column';
import { FuiDatagridEventService } from '../../services/event.service';
import { FuiDatagridEvents, RowClickedEvent, RowDoubleClickedEvent } from '../../events';

@Component({
  selector: 'fui-datagrid-body-row',
  template: `
    <ng-content select="fui-datagrid-body-cell"></ng-content>
    <ng-content></ng-content>
  `,
  host: {
    '[class.fui-datagrid-body-row]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiBodyRow implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'row';
  @HostBinding('style.height.px') rowHeight: number = 0;

  @Input() data: any;

  @HostBinding('class.fui-datagrid-first-row')
  get isFirstRow(): boolean {
    return this._isFirstRow;
  }

  set isFirstRow(value: boolean) {
    this._isFirstRow = value;
    this.cd.markForCheck();
  }

  @Input('rowIndex') set rowIndex(index) {
    this._rowIndex = index;
    this.cd.markForCheck();
    if (this._rowIndex === 0) {
      this.isFirstRow = true;
    }
    if (this.rowRendererService) {
      this.rowRendererService.storeRowElement(this.rowIndex, this);
    }
  }

  get rowIndex(): number {
    return this._rowIndex;
  }

  @ContentChildren(FuiBodyCell) cells: QueryList<FuiBodyCell>;

  private _isFirstRow: boolean = false;
  private _rowIndex: number = 0;

  constructor(
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
      type: FuiDatagridEvents.EVENT_ROW_CLICKED,
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
      type: FuiDatagridEvents.EVENT_ROW_DOUBLE_CLICKED,
    };
    this.eventService.dispatchEvent(evt);
  }

  ngOnInit(): void {
    if (this.optionsWrapperService && this.optionsWrapperService.gridOptions) {
      this.rowHeight = this.optionsWrapperService.gridOptions.rowHeight;
      this.cd.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.rowRendererService.removeRowElement(this.rowIndex);
  }

  getCellForCol(column: Column): FuiBodyCell {
    return this.cells.find(cell => cell.column.getColId() === column.getColId());
  }
}
