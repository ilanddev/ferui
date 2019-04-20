import { Injectable } from '@angular/core';
import { FuiBodyRow } from '../../components/body/body-row';
import { FuiBodyCell } from '../../components/body/body-cell';
import { Column } from '../../components/entities/column';

@Injectable()
export class RowRendererService {
  private indexPrefix: string = 'bodyRow';
  // This variable will contains only the visible (rendered) rows not all the rows from data-source.
  private rowsByIndex: { [key: string]: FuiBodyRow } = {};

  storeRowElement(rowIndex: number, rowElement: FuiBodyRow): void {
    this.rowsByIndex[this.indexPrefix + rowIndex] = rowElement;
  }

  removeRowElement(rowIndex: number): void {
    delete this.rowsByIndex[this.indexPrefix + rowIndex];
  }

  getAllCellsForColumn(column: Column): FuiBodyCell[] {
    const eCells: FuiBodyCell[] = [];
    for (const key in this.rowsByIndex) {
      if (this.rowsByIndex.hasOwnProperty(key)) {
        const eCell = this.rowsByIndex[key].getCellForCol(column);
        if (eCell) {
          eCells.push(eCell);
        }
      }
    }
    return eCells;
  }
}
