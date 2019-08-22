import { Injectable } from '@angular/core';
import { FuiHeaderRow } from '../../components/header/header-row';
import { FuiHeaderCell } from '../../components/header/header-cell';
import { Column } from '../../components/entities/column';

@Injectable()
export class HeaderRendererService {
  private headerRow: FuiHeaderRow;

  public storeRowElement(rowElement: FuiHeaderRow): void {
    this.headerRow = rowElement;
  }

  getCellForCol(column: Column): FuiHeaderCell {
    let cell: FuiHeaderCell = null;
    this.headerRow.cells.forEach(item => {
      if (item.colId === column.getId()) {
        cell = item;
      }
    });

    return cell;
  }

  public getCellForColumn(column: Column): FuiHeaderCell {
    return this.getCellForCol(column);
  }
}
