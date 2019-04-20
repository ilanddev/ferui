import { ChangeDetectionStrategy, Component, ContentChildren, HostBinding, Optional, QueryList } from '@angular/core';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiHeaderCell } from './header-cell';
import { HeaderRendererService } from '../../services/rendering/header-renderer.service';
import { Column } from '../entities/column';

@Component({
  selector: 'fui-datagrid-header-row',
  template: `
    <ng-content select="fui-datagrid-header-cell"></ng-content>`,
  host: {
    '[class.fui-datagrid-header-row]': 'true',
    '[style.top.px]': '0',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiHeaderRow {
  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height.px') headerHeight: number = 0;

  @ContentChildren(FuiHeaderCell) cells: QueryList<FuiHeaderCell>;

  constructor(
    @Optional() private rowRendererService: HeaderRendererService,
    @Optional() private optionsWrapperService: FuiDatagridOptionsWrapperService
  ) {}

  getCellForCol(column: Column): FuiHeaderCell {
    let cell: FuiHeaderCell = null;
    this.cells.forEach(item => {
      if (item.colId === column.getId()) {
        cell = item;
      }
    });

    return cell;
  }

  ngOnInit(): void {
    if (this.rowRendererService) {
      this.rowRendererService.storeRowElement(this);
    }
    if (this.optionsWrapperService && this.optionsWrapperService.gridOptions) {
      this.headerHeight = this.optionsWrapperService.gridOptions.headerHeight;
    }
  }
}
