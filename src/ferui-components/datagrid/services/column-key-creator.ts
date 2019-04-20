import { Injectable } from '@angular/core';
import { DatagridUtils } from '../utils/datagrid-utils';

@Injectable()
export class ColumnKeyCreator {
  private existingKeys: string[] = [];

  addExistingKeys(keys: string[]): void {
    this.existingKeys = this.existingKeys.concat(keys);
  }

  getUniqueKey(colId: string, colField: string): string {
    // in case user passed in number for colId, convert to string
    colId = DatagridUtils.toStringOrNull(colId);
    let count = 0;
    while (true) {
      let idToTry: string;
      if (colId) {
        idToTry = colId;
        if (count !== 0) {
          idToTry += '_' + count;
        }
      } else if (colField) {
        idToTry = colField;
        if (count !== 0) {
          idToTry += '_' + count;
        }
      } else {
        idToTry = '' + count;
      }

      if (this.existingKeys.indexOf(idToTry) < 0) {
        this.existingKeys.push(idToTry);
        return idToTry;
      }
      count++;
    }
  }
}
