import { Injectable } from '@angular/core';
import { FuiDatagridOptionsWrapperService } from '../services/datagrid-options-wrapper.service';
import { FuiColumnDefinitions } from '../types/column-definitions';

@Injectable()
export class ColumnUtilsService {
  constructor(private gridOptionsWrapper: FuiDatagridOptionsWrapperService) {}

  calculateColInitialWidth(colDef: FuiColumnDefinitions): number {
    if (!colDef.width) {
      // if no width defined in colDef, use default
      return this.gridOptionsWrapper.getColWidth();
    } else if (colDef.width < this.gridOptionsWrapper.getMinColWidth()) {
      // if width in col def to small, set to min width
      return this.gridOptionsWrapper.getMinColWidth();
    } else {
      // otherwise use the provided width
      return colDef.width;
    }
  }
}
