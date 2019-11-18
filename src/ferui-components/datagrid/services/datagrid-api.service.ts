import { FuiDatagridFilterService } from './datagrid-filter.service';
import { Injectable } from '@angular/core';
import { FuiColumnService } from './rendering/column.service';
import { FuiDatagridService } from './datagrid.service';

@Injectable()
export class FuiDatagridApiService {
  private columnService: FuiColumnService;
  private gridPanel: FuiDatagridService;

  constructor(public filterService: FuiDatagridFilterService) {}

  init(columnService: FuiColumnService, gridPanel: FuiDatagridService) {
    this.columnService = columnService;
    this.gridPanel = gridPanel;
  }

  // Gets columns to adjust in size to fit the grid horizontally.
  sizeColumnsToFit(): void {
    this.gridPanel.sizeColumnsToFit();
  }

  getViewportWidth(): number {
    return this.gridPanel.eBodyViewport.clientWidth;
  }

  getViewportScrollLeft(): number {
    return this.gridPanel.eBodyHorizontalScrollContainer.scrollLeft;
  }

  getViewportScrollTop(): number {
    return this.gridPanel.eCenterViewport.scrollTop;
  }

  getViewportContentOffsetTop(): number {
    const translateValues: string[] = this.getTranslate3d(this.gridPanel.virtualScrollViewport.contentElementRef.nativeElement);
    return parseInt(translateValues[1], 10);
  }

  getGridPanel(): FuiDatagridService {
    return this.gridPanel;
  }

  // Call to set new column definitions into the grid.
  // The grid will redraw all the column headers, and then redraw all of the rows.
  setColumnDefs(colDefs) {}

  // Set new rows into the grid.
  setRowData(rows: Array<any>) {}

  // Update row data into the grid. Pass a transaction object with lists for add, remove and update.
  updateRowData(transaction) {}

  // Returns the row model inside the table. From here you can see the original rows,
  // rows after filter has been applied, rows after aggregation has been applied, and
  // the final set of 'to be displayed' rows.
  getModel() {}

  // Gets the Client-side Row Model to refresh, executing the grouping, filtering and sorting again.
  refreshClientSideRowModel(params) {}

  // Select all rows (even rows that are not visible due to grouping being enabled and their groups not expanded).
  selectAll() {}

  // Clear all row selections.
  deselectAll() {}

  // Select all filtered rows.
  selectAllFiltered() {}

  // Clear all filtered selections.
  deselectAllFiltered() {}

  // Returns a list of selected rows (ie row data that you provided).
  getSelectedRows() {}

  // Gets the grid to do change detection on all cells and refresh the cell if needed.
  refreshCells(params) {}

  // Gets the grid to remove a row from the DOM and recreate it again from scratch.
  redrawRows(params) {}

  // Redraws the header. Useful if a column name changes, or something else that changes how the column header is displayed.
  refreshHeader() {}

  // Returns the focused cell as an object containing the rowIndex, column and floating (top, bottom or null).
  getFocusedCell() {}

  // Sets the focus to the specified cell. Set floating to null, 'top', or 'bottom'.
  setFocusedCell(rowIndex, colKey, floating) {}

  // Clears the focused cell.
  clearFocusedCell() {}

  // Navigates the grid focus to the next cell, as if tabbing.
  tabToNextCell() {}

  // Navigates the grid focus to the previous cell, as if shift-tabbing.
  tabToPreviousCell() {}

  // Does a CSV export of the grid's data.
  exportDataAsCsv(params) {}

  // Similar to exportDataAsCsv, except returns result as a string rather than export it.
  getDataAsCsv(params) {}

  // Show the loading overlay.
  showLoadingOverlay() {}

  // Show the 'no rows' overlay.
  showNoRowsOverlay() {}

  // Hides the overlay if showing.
  hideOverlay() {}

  // Sets the height for the row containing the column label header.
  setHeaderHeight(heightInPx) {}

  private getTranslate3d(el): string[] {
    const values = el.style.transform.split(/\w+\(|\);?/);
    if (!values[1] || !values[1].length) {
      return [];
    }
    return values[1].split(/,\s?/g);
  }
}
