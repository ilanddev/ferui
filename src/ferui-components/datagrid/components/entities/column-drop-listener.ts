import { DragSourceType, DropListener, HDirection } from '../../types/drag-and-drop';
import { DraggingEvent } from '../../events';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { Column } from './column';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { DatagridUtils } from '../../utils/datagrid-utils';

export class FuiColumnDropListener implements DropListener {
  private needToMoveLeft = false;
  private needToMoveRight = false;
  private movingIntervalId: number;
  private intervalCount: number;
  private lastDraggingEvent: DraggingEvent;
  private failedMoveAttempts: number;
  private readonly centerContainer: boolean;

  constructor(
    protected dragAndDropService: FuiDatagridDragAndDropService,
    protected columnService: FuiColumnService,
    protected gridPanel: FuiDatagridService
  ) {
    this.centerContainer = true;
  }

  getIconName(): string {
    return FuiDatagridDragAndDropService.ICON_MOVE;
  }

  onDragEnter(draggingEvent: DraggingEvent): void {
    // we do dummy drag, so make sure column appears in the right location when first placed
    const columns = draggingEvent.dragItem.columns;
    // restore previous state of visible columns upon re-entering. this means if the user drags
    // a group out, and then drags the group back in, only columns that were originally visible
    // will be visible again. otherwise a group with three columns (but only two visible) could
    // be dragged out, then when it's dragged in again, all three are visible. this stops that.
    const visibleState = draggingEvent.dragItem.visibleState;
    const visibleColumns: Column[] = columns.filter(column => visibleState[column.getId()]);
    this.setColumnsVisible(visibleColumns, true);
    this.onDragging(draggingEvent, true);
  }

  onDragLeave(draggingEvent: DraggingEvent): void {
    const hideColumnOnExit = !draggingEvent.fromNudge;
    if (hideColumnOnExit) {
      const dragItem = draggingEvent.dragSource.dragItemCallback();
      const columns = dragItem.columns;
      this.setColumnsVisible(columns, false);
    }
    this.ensureIntervalCleared();
  }

  onDragStop(): void {
    this.ensureIntervalCleared();
  }

  onDragging(draggingEvent: DraggingEvent, fromEnter = false): void {
    this.lastDraggingEvent = draggingEvent;

    // if moving up or down (ie not left or right) then do nothing
    if (DatagridUtils.missing(draggingEvent.hDirection)) {
      return;
    }

    const xNormalised = this.normaliseX(draggingEvent.x);

    // if the user is dragging into the panel, ie coming from the side panel into the main grid,
    // we don't want to scroll the grid this time, it would appear like the table is jumping
    // each time a column is dragged in.
    if (!fromEnter) {
      this.checkCenterForScrolling(xNormalised);
    }

    const hDirectionNormalised = this.normaliseDirection(draggingEvent.hDirection);

    const dragSourceType: DragSourceType = draggingEvent.dragSource.type;
    const columnsToMove = draggingEvent.dragSource.dragItemCallback().columns;
    this.attemptMoveColumns(dragSourceType, columnsToMove, hDirectionNormalised, xNormalised, fromEnter);
  }

  setColumnsVisible(columns: Column[], visible: boolean) {
    if (columns) {
      const allowedCols: Column[] = columns.filter(c => !c.isLockVisible());
      allowedCols.forEach(col => {
        col.setVisible(visible);
      });
    }
  }

  private normaliseDirection(hDirection: HDirection): HDirection {
    return hDirection;
  }

  private attemptMoveColumns(
    dragSourceType: DragSourceType,
    allMovingColumns: Column[],
    hDirection: HDirection,
    xAdjusted: number,
    fromEnter: boolean
  ): void {
    const draggingLeft = hDirection === HDirection.LEFT;
    const draggingRight = hDirection === HDirection.RIGHT;

    const validMoves: number[] = this.calculateValidMoves(allMovingColumns, draggingRight, xAdjusted);

    // if cols are not adjacent, then this returns null. when moving, we constrain the direction of the move
    // (ie left or right) to the mouse direction. however
    const oldIndex = this.calculateOldIndex(allMovingColumns);

    for (const newIndex of validMoves) {
      // the two check below stop an error when the user grabs a group my a middle column, then
      // it is possible the mouse pointer is to the right of a column while been dragged left.
      // so we need to make sure that the mouse pointer is actually left of the left most column
      // if moving left, and right of the right most column if moving right

      // we check 'fromEnter' below so we move the column to the new spot if the mouse is coming from
      // outside the grid, eg if the column is moving from side panel, mouse is moving left, then we should
      // place the column to the RHS even if the mouse is moving left and the column is already on
      // the LHS. otherwise we stick to the rule described above.

      let constrainDirection = oldIndex !== null && !fromEnter;

      // don't consider 'fromEnter' when dragging header cells, otherwise group can jump to opposite direction of drag
      if (dragSourceType === DragSourceType.HEADER) {
        constrainDirection = oldIndex !== null;
      }

      if (constrainDirection) {
        // only allow left drag if this column is moving left
        if (draggingLeft && newIndex >= oldIndex) {
          continue;
        }

        // only allow right drag if this column is moving right
        if (draggingRight && newIndex <= oldIndex) {
          continue;
        }
      }

      if (!this.columnService.doesMovePassRules(allMovingColumns, newIndex)) {
        continue;
      }

      this.columnService.moveColumns(allMovingColumns, newIndex);

      // important to return here, so once we do the first valid move, we don't try do any more
      return;
    }
  }

  private calculateValidMoves(movingCols: Column[], draggingRight: boolean, x: number): number[] {
    // this is the list of cols on the screen, so it's these we use when comparing the x mouse position
    const allDisplayedCols = this.columnService.getVisibleColumns();
    // but this list is the list of all cols, when we move a col it's the index within this list that gets used,
    // so the result we return has to be and index location for this list
    const allGridCols = this.columnService.getAllGridColumns();

    const colIsMovingFunc = (col: Column) => movingCols.indexOf(col) >= 0;
    const colIsNotMovingFunc = (col: Column) => movingCols.indexOf(col) < 0;

    const movingDisplayedCols = allDisplayedCols.filter(colIsMovingFunc);
    const otherDisplayedCols = allDisplayedCols.filter(colIsNotMovingFunc);
    const otherGridCols = allGridCols.filter(colIsNotMovingFunc);

    // work out how many DISPLAYED columns fit before the 'x' position. this gives us the displayIndex.
    // for example, if cols are a,b,c,d and we find a,b fit before 'x', then we want to place the moving
    // col between b and c (so that it is under the mouse position).
    let displayIndex = 0;
    let availableWidth = x;

    // if we are dragging right, then the columns will be to the left of the mouse, so we also want to
    // include the width of the moving columns
    if (draggingRight) {
      let widthOfMovingDisplayedCols = 0;
      movingDisplayedCols.forEach(col => (widthOfMovingDisplayedCols += col.getActualWidth()));
      availableWidth -= widthOfMovingDisplayedCols;
    }

    if (availableWidth > 0) {
      // now count how many of the displayed columns will fit to the left
      for (const col of otherDisplayedCols) {
        availableWidth -= col.getActualWidth();
        if (availableWidth < 0) {
          break;
        }
        displayIndex++;
      }
      // trial and error, if going right, we adjust by one, i didn't manage to quantify why, but it works
      if (draggingRight) {
        displayIndex++;
      }
    }

    // the display index is with respect to all the showing columns, however when we move, it's with
    // respect to all grid columns, so we need to translate from display index to grid index

    let gridColIndex: number;
    if (displayIndex > 0) {
      const leftColumn = otherDisplayedCols[displayIndex - 1];
      gridColIndex = otherGridCols.indexOf(leftColumn) + 1;
    } else {
      gridColIndex = 0;
    }

    const validMoves = [gridColIndex];

    // add in all adjacent empty columns as other valid moves. this allows us to try putting the new
    // column in any place of a hidden column, to try different combinations so that we don't break
    // married children. in other words, maybe the new index breaks a group, but only because some
    // columns are hidden, maybe we can reshuffle the hidden columns to find a place that works.
    let nextCol = allGridCols[gridColIndex];
    while (nextCol !== null && this.isColumnHidden(allDisplayedCols, nextCol)) {
      gridColIndex++;
      validMoves.push(gridColIndex);
      nextCol = allGridCols[gridColIndex];
    }

    return validMoves;
  }

  // isHidden takes into account visible=false and group=closed, ie it is not displayed
  private isColumnHidden(displayedColumns: Column[], col: Column) {
    return displayedColumns.indexOf(col) < 0;
  }

  private moveInterval(): void {
    // the amounts we move get bigger at each interval, so the speed accelerates, starting a bit slow
    // and getting faster. this is to give smoother user experience. we max at 100px to limit the speed.
    let pixelsToMove: number;
    this.intervalCount++;
    pixelsToMove = 10 + this.intervalCount * 5;
    if (pixelsToMove > 100) {
      pixelsToMove = 100;
    }

    let pixelsMoved: number;
    if (this.needToMoveLeft) {
      pixelsMoved = this.gridPanel.scrollHorizontally(-pixelsToMove);
    } else if (this.needToMoveRight) {
      pixelsMoved = this.gridPanel.scrollHorizontally(pixelsToMove);
    }

    if (pixelsMoved !== 0) {
      this.onDragging(this.lastDraggingEvent);
      this.failedMoveAttempts = 0;
    } else {
      this.failedMoveAttempts++;
    }
  }

  // returns the index of the first column in the list ONLY if the cols are all beside
  // each other. if the cols are not beside each other, then returns null
  private calculateOldIndex(movingCols: Column[]): number {
    const gridCols: Column[] = this.columnService.getAllGridColumns();
    const indexes: number[] = [];
    movingCols.forEach(col => indexes.push(gridCols.indexOf(col)));
    DatagridUtils.sortNumberArray(indexes);
    const firstIndex = indexes[0];
    const lastIndex = indexes[indexes.length - 1];
    const spread = lastIndex - firstIndex;
    const gapsExist = spread !== indexes.length - 1;
    return gapsExist ? null : firstIndex;
  }

  private normaliseX(x: number): number {
    // adjust for scroll only if centre container (the pinned containers dont scroll)
    const adjustForScroll = this.centerContainer;
    if (adjustForScroll) {
      x += this.gridPanel.getCenterViewportScrollLeft();
    }

    return x;
  }

  private checkCenterForScrolling(xAdjustedForScroll: number): void {
    if (this.centerContainer) {
      // scroll if the mouse has gone outside the grid (or just outside the scrollable part if pinning)
      // putting in 50 buffer, so even if user gets to edge of grid, a scroll will happen
      const firstVisiblePixel = this.gridPanel.getCenterViewportScrollLeft();
      const lastVisiblePixel = firstVisiblePixel + this.gridPanel.getCenterWidth();

      this.needToMoveLeft = xAdjustedForScroll < firstVisiblePixel + 50;
      this.needToMoveRight = xAdjustedForScroll > lastVisiblePixel - 50;

      if (this.needToMoveLeft || this.needToMoveRight) {
        this.ensureIntervalStarted();
      } else {
        this.ensureIntervalCleared();
      }
    }
  }

  private ensureIntervalStarted(): void {
    if (!this.movingIntervalId) {
      this.intervalCount = 0;
      this.failedMoveAttempts = 0;
      this.movingIntervalId = window.setInterval(this.moveInterval.bind(this), 100);
      if (this.needToMoveLeft) {
        this.dragAndDropService.setGhostIcon(FuiDatagridDragAndDropService.ICON_LEFT, true);
      } else {
        this.dragAndDropService.setGhostIcon(FuiDatagridDragAndDropService.ICON_RIGHT, true);
      }
    }
  }

  private ensureIntervalCleared(): void {
    if (this.moveInterval) {
      window.clearInterval(this.movingIntervalId);
      this.movingIntervalId = null;
      this.dragAndDropService.setGhostIcon(FuiDatagridDragAndDropService.ICON_MOVE);
    }
  }
}
