import { Injectable } from '@angular/core';
import { Column } from '../../components/entities/column';
import { DatagridUtils } from '../../utils/datagrid-utils';
import {
  ColumnEvent,
  ColumnMovedEvent,
  ColumnResizedEvent,
  ColumnVisibleEvent,
  DisplayedColumnsWidthChangedEvent,
  FuiDatagridEvents
} from '../../events';
import { FuiDatagridApiService } from '../datagrid-api.service';
import { FuiDatagridColumnApiService } from '../datagrid-column-api.service';
import { FuiDatagridEventService } from '../event.service';
import { AutoWidthCalculator } from './autoWidthCalculator';

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
    private eventService: FuiDatagridEventService,
    private autoWidthColumnService: AutoWidthCalculator
  ) {}

  moveColumns(columnsToMoveKeys: (string | Column)[], toIndex: number): void {
    if (toIndex > this.allDisplayedColumns.length - columnsToMoveKeys.length) {
      console.warn('fui-datagrid: tried to insert columns in invalid location, toIndex = ' + toIndex);
      console.warn('fui-datagrid: remember that you should not count the moving columns when calculating the new index');
      return;
    }

    // we want to pull all the columns out first and put them into an ordered list
    const columnsToMove: Column[] = this.getGridColumns(columnsToMoveKeys);

    const failedRules: boolean = !this.doesMovePassRules(columnsToMove, toIndex);
    if (failedRules) {
      return;
    }

    // When we switch the columns array, it trigger angular change which is causing a DOM manipulation.
    // Since both columns element are deleted then re-added from DOM at the good index, the CSS animation fail.
    DatagridUtils.moveInArray(this.allDisplayedColumns, columnsToMove, toIndex);

    // We can't control the animation through Angular Animation because we don't have any way to trigger an animation
    // on move event (i.e column switching). See https://github.com/angular/angular/issues/19727
    // The only solution is to add a delay between the columns switching (updating the indexes + left values)
    // and the actual columns array re-ordering (DOM manipulation).
    setTimeout(() => {
      this.updateDisplayedColumns();
    }, 0);

    const event: ColumnMovedEvent = {
      type: FuiDatagridEvents.EVENT_COLUMN_MOVED,
      columns: columnsToMove,
      column: columnsToMove.length === 1 ? columnsToMove[0] : null,
      toIndex: toIndex,
      api: this.gridApi,
      columnApi: this.columnApi
    };
    this.eventService.dispatchEvent(event);
  }

  setDisplayedColumns(columns: Column[]) {
    this.allDisplayedColumns = columns;
  }

  addColumn(column: Column) {
    const colIndex: number = this.allDisplayedColumns.findIndex(c => {
      return c.getColId() === column.getColId();
    });
    // If the column already exist, we update it.
    if (colIndex >= 0) {
      this.allDisplayedColumns.splice(colIndex, 1, column);
    } else {
      this.allDisplayedColumns.push(column);
    }
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
          columnApi: this.columnApi
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
    const allDisplayedColumns: Column[] = this.getVisibleColumns();

    // avoid divide by zero
    if (gridWidth <= 0 || allDisplayedColumns.length === 0) {
      return;
    }

    const colsToNotSpread: Column[] = allDisplayedColumns.filter((column: Column) => {
      return column.getColumnDefinition().suppressSizeToFit === true;
    });

    const colsToSpread: Column[] = allDisplayedColumns.filter((column: Column) => {
      return column.getColumnDefinition().suppressSizeToFit !== true;
    });

    // make a copy of the cols that are going to be resized
    const colsToFireEventFor: Column[] = [...colsToSpread];

    let finishedResizing: boolean = false;

    while (!finishedResizing) {
      finishedResizing = true;
      const availablePixels: number = gridWidth - this.getWidthOfColsInList(colsToNotSpread);
      if (availablePixels <= 0) {
        // no width, set everything to minimum
        colsToSpread.forEach((column: Column) => {
          column.setMinimum();
        });
      } else {
        const scale: number = availablePixels / this.getWidthOfColsInList(colsToSpread);
        // we set the pixels for the last col based on what's left, as otherwise
        // we could be a pixel or two short or extra because of rounding errors.
        let pixelsForLastCol: number = availablePixels;
        // backwards through loop, as we are removing items as we go
        for (let i = colsToSpread.length - 1; i >= 0; i--) {
          const column: Column = colsToSpread[i];
          const newWidth: number = Math.round(column.getActualWidth() * scale);
          if (column.isLessThanMin(newWidth)) {
            column.setMinimum();
            moveToNotSpread(column);
            finishedResizing = false;
          } else if (column.isGreaterThanMax(newWidth)) {
            column.setToMaximum();
            moveToNotSpread(column);
            finishedResizing = false;
          } else {
            const onLastCol: boolean = i === 0;
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

    this.setLeftValues(true);
    this.updateBodyWidths();

    colsToFireEventFor.forEach((column: Column) => {
      const event: ColumnResizedEvent = {
        type: FuiDatagridEvents.EVENT_COLUMN_RESIZED,
        column: column,
        columns: [column],
        finished: true,
        api: this.gridApi,
        columnApi: this.columnApi
      };
      this.eventService.dispatchEvent(event);
    });

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

  setLeftValues(resetOldValues?: boolean): void {
    let left = 0;
    this.getVisibleColumns().forEach(column => {
      column.setLeft(left);
      if (resetOldValues) {
        column.setOldLeft(left);
      }
      left += column.getActualWidth();
    });
  }

  autoSizeColumns(keys: (string | Column)[], eBodyContainer: HTMLElement): void {
    // because of column virtualisation, we can only do this function on columns that are
    // actually rendered, as non-rendered columns (outside the viewport and not rendered
    // due to column virtualisation) are not present. this can result in all rendered columns
    // getting narrowed, which in turn introduces more rendered columns on the RHS which
    // did not get autosized in the original run, leaving the visible grid with columns on
    // the LHS sized, but RHS no. so we keep looping through teh visible columns until
    // no more cols are available (rendered) to be resized

    // keep track of which cols we have resized in here
    const columnsAutosized: Column[] = [];
    // initialise with anything except 0 so that while loop executes at least once
    let changesThisTimeAround = -1;

    while (changesThisTimeAround !== 0) {
      changesThisTimeAround = 0;
      this.actionOnGridColumns(keys, (column: Column): boolean => {
        // if already autosized, skip it
        if (columnsAutosized.indexOf(column) >= 0) {
          return false;
        }

        // get how wide this col should be
        const preferredWidth = this.autoWidthColumnService.getPreferredWidthForColumn(column, eBodyContainer);
        // preferredWidth = -1 if this col is not on the screen
        if (preferredWidth > 0) {
          const newWidth = this.normaliseColumnWidth(column, preferredWidth);
          column.setActualWidth(newWidth);
          columnsAutosized.push(column);
          changesThisTimeAround++;
        }
        return true;
      });
    }

    // Now, we need to check if the grid is filled entirely or if there is spare space.
    const visibleColumnsTotalWidth: number = this.getWidthOfColsInList(
      this.getVisibleColumns().map(key => this.getGridColumn(key))
    );
    const gridWidth: number = eBodyContainer.parentElement.clientWidth;
    // If there is spare space, we will assign this space to all column equally.
    if (visibleColumnsTotalWidth < gridWidth) {
      const sparedSpace: number = gridWidth - visibleColumnsTotalWidth;
      const preferredWidthByColumn: number = sparedSpace / keys.length;
      this.actionOnGridColumns(keys, (column: Column): boolean => {
        const newWidth = this.normaliseColumnWidth(column, column.getActualWidth() + preferredWidthByColumn);
        column.setActualWidth(newWidth);
        return true;
      });
    }

    this.setLeftValues(true);

    if (columnsAutosized.length > 0) {
      const event: ColumnResizedEvent = {
        type: FuiDatagridEvents.EVENT_COLUMN_RESIZED,
        columns: columnsAutosized,
        column: columnsAutosized.length === 1 ? columnsAutosized[0] : null,
        finished: true,
        api: this.gridApi,
        columnApi: this.columnApi
      };
      this.eventService.dispatchEvent(event);
    }
  }

  autoSizeColumn(key: string | Column | null, eBodyContainer: HTMLElement): void {
    if (key) {
      this.autoSizeColumns([key], eBodyContainer);
    }
  }

  autoSizeAllColumns(eBodyContainer: HTMLElement): void {
    const allDisplayedColumns = this.getVisibleColumns();
    this.autoSizeColumns(allDisplayedColumns, eBodyContainer);
  }

  updateDisplayedColumns(): void {
    this.updateColumnsIndexes();
    this.setLeftValues(true);
    this.updateBodyWidths();
  }

  // does an action on a set of columns. provides common functionality for looking up the
  // columns based on key, getting a list of effected columns, and then updated the event
  // with either one column (if it was just one col) or a list of columns
  private actionOnGridColumns(
    // the column keys this action will be on
    keys: (string | Column)[],
    // the action to do - if this returns false, the column was skipped
    // and won't be included in the event
    action: (column: Column) => boolean,
    // should return back a column event of the right type
    createEvent?: () => ColumnEvent
  ): void {
    if (DatagridUtils.missingOrEmpty(keys)) {
      return;
    }

    const updatedColumns: Column[] = [];

    keys.forEach((key: string | Column) => {
      const column = this.getGridColumn(key);
      if (!column) {
        return;
      }
      // need to check for false with type (ie !== instead of !=)
      // as not returning anything (undefined) would also be false
      const resultOfAction = action(column);
      if (resultOfAction !== false) {
        updatedColumns.push(column);
      }
    });
    if (updatedColumns.length === 0) {
      return;
    }

    this.updateDisplayedColumns();

    if (DatagridUtils.exists(createEvent) && createEvent) {
      const event = createEvent();
      event.columns = updatedColumns;
      event.column = updatedColumns.length === 1 ? updatedColumns[0] : null;

      this.eventService.dispatchEvent(event);
    }
  }

  // returns the width we can set to this col, taking into consideration min and max widths
  private normaliseColumnWidth(column: Column, newWidth: number): number {
    if (newWidth < column.getMinWidth()) {
      newWidth = column.getMinWidth();
    }
    if (column.isGreaterThanMax(newWidth)) {
      newWidth = column.getMaxWidth();
    }
    return newWidth;
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

  private updateColumnsIndexes(): void {
    let colIndex: number = 0;
    this.getAllDisplayedColumns().forEach(column => {
      column.colIndex = colIndex;
      colIndex++;
    });
  }

  // after setColumnWidth or updateGroupsAndDisplayedColumns
  private updateBodyWidths(): void {
    const newBodyWidth = this.getWidthOfColsInList(this.allDisplayedColumns);

    const atLeastOneChanged = this.bodyWidth !== newBodyWidth;

    if (atLeastOneChanged) {
      this.bodyWidth = newBodyWidth;
      // when this fires, it is picked up by the gridPanel, which ends up in
      // gridPanel calling setWidthAndScrollPosition(), which in turn calls setVirtualViewportPosition()
      const event: DisplayedColumnsWidthChangedEvent = {
        type: FuiDatagridEvents.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED,
        api: this.gridApi,
        columnApi: this.columnApi
      };
      this.eventService.dispatchEvent(event);
    }
  }

  private getWidthOfColsInList(columnList: Column[]): number {
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
