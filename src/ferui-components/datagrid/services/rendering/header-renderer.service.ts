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

  public getAllCellsForColumn(column: Column): FuiHeaderCell[] {
    const eCells: FuiHeaderCell[] = [];
    const eCell = this.headerRow.getCellForCol(column);
    if (eCell) {
      eCells.push(eCell);
    }
    return eCells;
  }
}
