import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
} from '@angular/core';
import { FuiBodyCell } from './body-cell';
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { Column } from '../entities/column';

@Component({
  selector: 'fui-datagrid-body-row',
  template: `
    <ng-content select="fui-datagrid-body-cell"></ng-content><ng-content></ng-content>
  `,
  host: {
    '[class.fui-datagrid-body-row]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiBodyRow implements OnInit, OnDestroy {
  @HostBinding('attr.role') role: string = 'row';
  @HostBinding('style.height.px') rowHeight: number = 0;

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
    @Optional() private rowRendererService: RowRendererService,
    @Optional() private optionsWrapperService: FuiDatagridOptionsWrapperService
  ) {}

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
    return this.cells.filter(cell => {
      return cell.colId === column.getId();
    })[0];
  }
}
