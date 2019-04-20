import { Injectable } from '@angular/core';
import { Column } from '../../components/entities/column';
import { DatagridUtils } from '../../utils/datagrid-utils';
import { ColumnMovedEvent, ColumnVisibleEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridApiService } from '../datagrid-api.service';
import { FuiDatagridColumnApiService } from '../datagrid-column-api.service';
import { FuiDatagridEventService } from '../event.service';

@Injectable()
export class FuiColumnService {
  private lastLeftValue: number = 0;
  private bodyWidth: number = 0;
  private allDisplayedColumns: Column[] = [];
  // same as above, except trimmed down to only columns within the viewport
  private allDisplayedVirtualColumns: Column[] = [];

  constructor(
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService,
    private eventService: FuiDatagridEventService
  ) {}

  moveColumns(columnsToMoveKeys: (string | Column)[], toIndex: number): void {
    if (toIndex > this.allDisplayedColumns.length - columnsToMoveKeys.length) {
      console.warn('fui-datagrid: tried to insert columns in invalid location, toIndex = ' + toIndex);
      console.warn('fui-datagrid: remember that you should not count the moving columns when calculating the new index');
      return;
    }

    // we want to pull all the columns out first and put them into an ordered list
    const columnsToMove = this.getGridColumns(columnsToMoveKeys);

    const failedRules = !this.doesMovePassRules(columnsToMove, toIndex);
    if (failedRules) {
      return;
    }

    const columns: Column[] = [...this.allDisplayedColumns];
    DatagridUtils.moveInArray(columns, columnsToMove, toIndex);
    let left: number = 0;
    let colIndex: number = 0;
    columns.forEach(column => {
      if (column.isVisible()) {
        column.setLeft(left);
        column.setOldLeft(left);
        left += column.getActualWidth();
      } else {
        column.setLeft(0);
        column.setOldLeft(0);
      }
      column.colIndex = colIndex;
      colIndex++;
    });

    const event: ColumnMovedEvent = {
      type: FuiDatagridEvents.EVENT_COLUMN_MOVED,
      columns: columns,
      column: columnsToMove.length === 1 ? columnsToMove[0] : null,
      toIndex: toIndex,
      api: this.gridApi,
      columnApi: this.columnApi,
    };
    this.eventService.dispatchEvent(event);
  }

  setDisplayedColumns(columns: Column[]) {
    this.allDisplayedColumns = columns;
  }

  addColumn(column: Column) {
    this.allDisplayedColumns.push(column);
  }

  removeColumn(column: Column) {
    const colIndex: number = this.allDisplayedColumns.findIndex(c => {
      return c.getColId() === column.getColId();
    });
    if (colIndex >= 0) {
      this.allDisplayedColumns.splice(colIndex, 1);
    } else {
      console.error(`The column ${column.name} does not exist.`);
    }
  }

  changeColumnVisibility(column: Column, visible: boolean) {
    if (column) {
      const col: Column = this.getAllDisplayedColumns().find(c => {
        return c.getColId() === column.getColId();
      });
      if (col) {
        col.setVisible(visible);
        const event: ColumnVisibleEvent = {
          type: FuiDatagridEvents.EVENT_VISIBLE_CHANGED,
          columns: this.getAllDisplayedColumns(),
          column: col,
          visible: visible,
          api: this.gridApi,
          columnApi: this.columnApi,
        };
        this.eventService.dispatchEvent(event);
      }
    }
  }

  getVisibleColumns(): Column[] | null {
    if (!this.getAllDisplayedColumns() || (this.getAllDisplayedColumns() && this.getAllDisplayedColumns().length < 0)) {
      return null;
    }
    return this.getAllDisplayedColumns().filter(col => {
      return col.isVisible();
    });
  }

  getHiddenColumns(): Column[] {
    if (!this.getAllDisplayedColumns() || (this.getAllDisplayedColumns() && this.getAllDisplayedColumns().length < 0)) {
      return null;
    }
    return this.getAllDisplayedColumns().filter(col => {
      return !col.isVisible();
    });
  }

  getFilteredColumns(): Column[] | null {
    if (!this.hasFilters()) {
      return null;
    }
    const filteredColumns: Column[] = [];
    for (const col of this.getVisibleColumns()) {
      if (col.filter !== undefined && col.filter !== null) {
        filteredColumns.push(col);
      }
    }
    return filteredColumns;
  }

  hasFilters(): boolean {
    if (this.getVisibleColumns() === null) {
      return false;
    }
    for (const col of this.getVisibleColumns()) {
      if (col.filter !== undefined && col.filter !== null) {
        return true;
      }
    }
    return false;
  }

  getAllGridColumns(): Column[] {
    return this.allDisplayedColumns;
  }

  // gridPanel -> ensureColumnVisible
  isColumnDisplayed(column: Column): boolean {
    return this.getAllDisplayedColumns().indexOf(column) >= 0;
  }

  getLastLeftValue(): number {
    return this.lastLeftValue;
  }

  setLastLeftValue(leftValue: number) {
    this.lastLeftValue += leftValue;
  }

  getAllDisplayedColumns(): Column[] {
    return this.allDisplayedColumns;
  }

  getAllDisplayedVirtualColumns(): Column[] {
    return this.allDisplayedVirtualColumns;
  }

  getTotalColumnWidth(): number {
    if (this.getVisibleColumns().length > 0) {
      let totalWidth = 0;
      this.getVisibleColumns().forEach(column => {
        totalWidth += column.getActualWidth();
      });
      return totalWidth;
    }
    return null;
  }

  updateColumnsPosition(): void {
    let left = 0;
    this.getVisibleColumns().forEach(column => {
      column.setLeft(left);
      column.setOldLeft(left);
      left += column.getActualWidth();
    });
    this.getHiddenColumns().forEach(column => {
      column.setLeft(0);
      column.setOldLeft(0);
    });
  }

  sizeColumnsToFit(gridWidth: any): void {
    // avoid divide by zero
    const allDisplayedColumns = this.getAllDisplayedColumns();

    if (gridWidth <= 0 || allDisplayedColumns.length === 0) {
      return;
    }

    const colsToNotSpread = allDisplayedColumns.filter((column: Column) => {
      return column.getColumnDefinition().suppressSizeToFit === true;
    });

    const colsToSpread = allDisplayedColumns.filter((column: Column) => {
      return column.getColumnDefinition().suppressSizeToFit !== true;
    });

    // make a copy of the cols that are going to be resized
    //const colsToFireEventFor = colsToSpread.slice(0);

    let finishedResizing = false;
    while (!finishedResizing) {
      finishedResizing = true;
      const availablePixels = gridWidth - this.getWidthOfColsInList(colsToNotSpread);
      if (availablePixels <= 0) {
        // no width, set everything to minimum
        colsToSpread.forEach((column: Column) => {
          column.setMinimum();
        });
      } else {
        const scale = availablePixels / this.getWidthOfColsInList(colsToSpread);
        // we set the pixels for the last col based on what's left, as otherwise
        // we could be a pixel or two short or extra because of rounding errors.
        let pixelsForLastCol = availablePixels;
        // backwards through loop, as we are removing items as we go
        for (let i = colsToSpread.length - 1; i >= 0; i--) {
          const column = colsToSpread[i];
          const newWidth = Math.round(column.getActualWidth() * scale);
          if (newWidth < column.getMinWidth()) {
            column.setMinimum();
            moveToNotSpread(column);
            finishedResizing = false;
          } else if (column.isGreaterThanMax(newWidth)) {
            column.setActualWidth(column.getMaxWidth());
            moveToNotSpread(column);
            finishedResizing = false;
          } else {
            const onLastCol = i === 0;
            if (onLastCol) {
              column.setActualWidth(pixelsForLastCol);
            } else {
              column.setActualWidth(newWidth);
            }
          }
          pixelsForLastCol -= newWidth;
        }
      }
    }

    this.setLeftValues();
    this.updateBodyWidths();

    // colsToFireEventFor.forEach((column: Column) => {
    //   const event: ColumnResizedEvent = {
    //     type: FuiDatagridEvents.EVENT_COLUMN_RESIZED,
    //     column: column,
    //     columns: [column],
    //     finished: true,
    //     api: this.gridApi,
    //     columnApi: this.columnApi
    //   };
    //   this.eventService.dispatchEvent(event);
    // });

    function moveToNotSpread(column: Column) {
      DatagridUtils.removeFromArray(colsToSpread, column);
      colsToNotSpread.push(column);
    }
  }

  doesMovePassRules(columnsToMove: Column[], toIndex: number): boolean {
    // make a copy of what the grid columns would look like after the move
    const proposedColumnOrder = this.allDisplayedColumns.slice();
    DatagridUtils.moveInArray(proposedColumnOrder, columnsToMove, toIndex);

    return true;
  }

  moveColumn(key: string | Column, toIndex: number) {
    this.moveColumns([key], toIndex);
  }

  getGridColumns(keys: (string | Column)[]): Column[] {
    return this.getColumns(keys, this.getGridColumn.bind(this));
  }

  getGridColumn(key: string | Column): Column | null {
    return this.getColumn(key, this.allDisplayedColumns);
  }

  getNextColumnsFrom(column: Column) {
    const gridColumn = this.getGridColumn(column);
    return this.getAllDisplayedColumns().slice(gridColumn.colIndex + 1);
  }

  setLeftValues(): void {
    let left = 0;
    this.getVisibleColumns().forEach(column => {
      column.setLeft(left);
      left += column.getActualWidth();
    });

    // items left in allColumns are columns not displayed, so remove the left position. this is
    // important for the rows, as if a col is made visible, then taken out, then made visible again,
    // we don't want the animation of the cell floating in from the old position, whatever that was.
    // allColumns.forEach((column: Column) => {
    //   column.setLeft(null, source);
    // });
  }

  private getColumn(key: string | Column, columnList: Column[]): Column | null {
    if (!key) {
      return null;
    }
    for (const col of columnList) {
      if (this.columnsMatch(col, key)) {
        return col;
      }
    }

    return null;
  }

  // after setColumnWidth or updateGroupsAndDisplayedColumns
  private updateBodyWidths(): void {
    const newBodyWidth = this.getWidthOfColsInList(this.allDisplayedColumns);

    const atLeastOneChanged = this.bodyWidth !== newBodyWidth;

    if (atLeastOneChanged) {
      this.bodyWidth = newBodyWidth;
      // when this fires, it is picked up by the gridPanel, which ends up in
      // gridPanel calling setWidthAndScrollPosition(), which in turn calls setVirtualViewportPosition()
      // const event: DisplayedColumnsWidthChangedEvent = {
      //   type: Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED,
      //   api: this.gridApi,
      //   columnApi: this.columnApi
      // };
      // this.eventService.dispatchEvent(event);
    }
  }

  private getWidthOfColsInList(columnList: Column[]) {
    let result = 0;
    for (const column of columnList) {
      result += column.getActualWidth();
    }
    return result;
  }

  private columnsMatch(column: Column, key: string | Column): boolean {
    const columnMatches = column === key;
    const colDefMatches = column.getColumnDefinition() === key;
    const idMatches = column.getColId() === key;
    return columnMatches || colDefMatches || idMatches;
  }

  private getColumns(keys: (string | Column)[], columnLookupCallback: (key: string | Column) => Column): Column[] {
    const foundColumns: Column[] = [];
    if (keys) {
      keys.forEach((key: string | Column) => {
        const column = columnLookupCallback(key);
        if (column) {
          foundColumns.push(column);
        }
      });
    }
    return foundColumns;
  }
}
