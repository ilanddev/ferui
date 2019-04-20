import { Injectable } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Column } from '../components/entities/column';
import { FuiColumnService } from './rendering/column.service';
import { ColumnResizedEvent, FuiDatagridEvents } from '../events';
import { FuiDatagridEventService } from './event.service';

export interface DatagridResizeParams {
  eElement: HTMLElement;
  minWidth: number;
  maxWidth: number;
  column: Column;
  columnService: FuiColumnService;
}

@Injectable()
export class FuiDatagridResizeService {
  private subscriptions: Subscription[] = [];
  private currentColumn: Column;

  private minWidth: number = 0;
  private maxWidth: number = null;

  private dragEndFunctions: Function[] = [];
  private columnService: FuiColumnService;

  constructor(private eventService: FuiDatagridEventService) {}

  addResizeFor(params: DatagridResizeParams) {
    if (!params.column) {
      console.warn('You need to specify the column to add the resize event.');
      return;
    }
    this.columnService = params.columnService;
    this.minWidth = params.minWidth;
    this.maxWidth = params.maxWidth;
    this.currentColumn = params.column;
    const mouseDownEvent = fromEvent(params.eElement, 'mousedown');
    this.subscriptions.push(mouseDownEvent.subscribe((ev: MouseEvent) => this.onMouseDown(ev)));
  }

  removeResize() {
    this.destroySubscriptions();
  }

  private getCurrentColumn(): Column {
    return this.columnService.getGridColumn(this.currentColumn);
  }

  private getColIndex(): number {
    return this.getCurrentColumn().colIndex;
  }

  private onMouseDown(event: MouseEvent) {
    const initialWidth = this.getCurrentColumn().getActualWidth();
    const mouseDownScreenX = event.screenX;

    const mouseup = fromEvent(document, 'mouseup');
    const mouseUpListener = mouseup.subscribe((ev: MouseEvent) => this.onMouseup(ev));

    const mouseMoveListener = fromEvent(document, 'mousemove')
      .pipe(takeUntil(mouseup))
      .subscribe((e: MouseEvent) => this.onMouseMove(e, initialWidth, mouseDownScreenX));

    this.dragEndFunctions.push(() => {
      mouseMoveListener.unsubscribe();
      mouseUpListener.unsubscribe();
    });
    this.eventService.dispatchEvent(this.createResizeEvent(false));
  }

  private onMouseup(event: MouseEvent) {
    // We change the oldLeft value for all next columns.
    this.columnService.getVisibleColumns().forEach(column => {
      column.setOldLeft(column.getLeft());
    });

    this.dragEndFunctions.forEach(func => func());
    this.dragEndFunctions.length = 0;
    this.eventService.dispatchEvent(this.createResizeEvent(true));
  }

  private onMouseMove(event: MouseEvent, initialWidth, mouseDownScreenX) {
    const movementX: number = event.screenX - mouseDownScreenX;
    const newWidth: number = initialWidth + movementX;

    const overMinWidth = !this.minWidth || newWidth >= this.minWidth;
    const underMaxWidth = !this.maxWidth || newWidth <= this.maxWidth;

    if (overMinWidth && underMaxWidth) {
      // We change the column width.
      this.getCurrentColumn().setActualWidth(newWidth);
      // We change the left value for all next columns.
      this.columnService.getNextColumnsFrom(this.getCurrentColumn()).forEach(column => {
        // We store the original left value
        column.setLeft(column.getOldLeft() + movementX);
      });
    }
    this.eventService.dispatchEvent(this.createResizeEvent(false));
  }

  private destroySubscriptions() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  private createResizeEvent(finished: boolean): ColumnResizedEvent {
    return {
      api: null,
      columnApi: null,
      columns: this.columnService.getAllDisplayedColumns(),
      column: this.getCurrentColumn(),
      type: FuiDatagridEvents.EVENT_COLUMN_RESIZED,
      finished: finished,
    };
  }
}
