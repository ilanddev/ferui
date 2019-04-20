import { Injectable } from '@angular/core';
import { FuiDatagridOptionsWrapperService } from '../services/datagrid-options-wrapper.service';
import { FuiColumnDefinitions } from '../types/column-definitions';

@Injectable()
export class ColumnUtilsService {
  private headerSortingBadgesWidth: number = 50; // In px. This value represent the two sorting badges that appears
  // near the column name.
  // It should be added to the minWidth, maxWidth and width defined by the user.

  constructor(private gridOptionsWrapper: FuiDatagridOptionsWrapperService) {}

  calculateColInitialWidth(colDef: FuiColumnDefinitions): number {
    if (!colDef.width) {
      // if no width defined in colDef, use default
      return this.gridOptionsWrapper.getColWidth() + this.headerSortingBadgesWidth;
    } else if (colDef.width < this.gridOptionsWrapper.getMinColWidth()) {
      // if width in col def to small, set to min width
      return this.gridOptionsWrapper.getMinColWidth() + this.headerSortingBadgesWidth;
    } else {
      // otherwise use the provided width
      return colDef.width + this.headerSortingBadgesWidth;
    }
  }
}
