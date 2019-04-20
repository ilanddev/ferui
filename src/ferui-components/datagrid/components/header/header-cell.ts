import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  Self,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FuiColumnDefinitions } from '../../types/column-definitions';
import { Column } from '../entities/column';
import { FuiDatagridSortDirections } from '../../types/sort-directions.enum';
import { FuiDatagridSortService } from '../../services/datagrid-sort.service';
import { Subscription } from 'rxjs';
import { ColumnEvent, FuiDatagridEvents } from '../../events';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { DragItem, DragSource, DragSourceType } from '../../types/drag-and-drop';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiDatagridBodyDropTarget } from '../entities/body-drop-target';
import { DatagridResizeParams, FuiDatagridResizeService } from '../../services/datagrid-resize.service';
import { FuiDatagridEventService } from '../../services/event.service';
import { ColumnKeyCreator } from '../../services/column-key-creator';

@Component({
  selector: 'fui-datagrid-header-cell',
  template: `
    <div
      class="fui-datagrid-header-label"
      #headerLabel
      role="presentation"
      unselectable="on"
      (click)="onHeaderClick($event)"
    >
      <div class="fui-datagrid-header-text" role="presentation" unselectable="on" #datagridHeaderText>
        <ng-container [ngTemplateOutlet]="defaultCellRenderer" [ngTemplateOutletContext]="columnDefinition"></ng-container>
        <ng-template #defaultCellRenderer let-label="headerName">{{ label }}</ng-template>
      </div>
      <span class="fui-datagrid-sort" *ngIf="displayAscDescIcon() === fuiDatagridSortDirections.ASC">
        <ng-container [ngTemplateOutlet]="sortAscIcon"></ng-container>
      </span>
      <span class="fui-datagrid-sort" *ngIf="displayAscDescIcon() === fuiDatagridSortDirections.DESC">
        <ng-container [ngTemplateOutlet]="sortDescIcon"></ng-container>
      </span>
      <span
        class="fui-datagrid-sort-badge"
        *ngIf="displayAscDescIcon() !== fuiDatagridSortDirections.NONE && isMultisort()"
      >
        <span class="badge badge-secondary">
          {{ column.sortOrder + 1 }}
        </span>
      </span>
    </div>

    <div class="fui-datagrid-header-cell-resize" #headerResize role="presentation"></div>

    <ng-template #sortAscIcon>
      <clr-icon class="fui-datagrid-sort-asc" shape="fui-arrow-thin" dir="up"></clr-icon>
    </ng-template>
    <ng-template #sortDescIcon>
      <clr-icon class="fui-datagrid-sort-desc" shape="fui-arrow-thin" dir="down"></clr-icon>
    </ng-template>
  `,
  host: {
    '[class.fui-datagrid-header-cell]': 'true',
    '[class.fui-datagrid-column-visible]': 'column.isVisible()',
    '[class.with-animation]': 'true',
    '[class.moving]': 'column.isMoving()',
    '[class.dragging]': 'isDragging()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FuiDatagridResizeService, Column],
})
export class FuiHeaderCell extends FuiDatagridBodyDropTarget implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Output() resize: EventEmitter<ColumnEvent> = new EventEmitter();
  @Output() dragColumnStart: EventEmitter<ColumnEvent> = new EventEmitter();
  @Output() dragColumnsChange: EventEmitter<ColumnEvent> = new EventEmitter();
  @Output() changeVisibility: EventEmitter<ColumnEvent> = new EventEmitter();

  fuiDatagridSortDirections = FuiDatagridSortDirections;
  colId: string;

  @Input() columnDefinition: FuiColumnDefinitions;

  @ViewChild('datagridHeaderText') datagridHeaderText: ElementRef;
  @ViewChild('headerLabel') headerLabel: ElementRef;
  @ViewChild('headerResize') headerResize: ElementRef;
  @ViewChild('sortAscIcon') sortAscIcon: TemplateRef<any>;
  @ViewChild('sortDescIcon') sortDescIcon: TemplateRef<any>;

  private readonly element: HTMLElement;

  private destroyFunctions: (() => void)[] = [];
  private subscriptions: Subscription[] = [];
  private dragging: boolean = false;
  private dragSource: DragSource;

  private _role: string = 'presentation';
  private _width: number = 0;
  private _minWidth: number = 0;
  private _maxWidth: number = null;
  private _left: number = 0;
  private _lineHeight: number = null;
  private _sortable: boolean;
  private _colIndex: number;
  private _columns: Column[];
  private _rowHeight: number;

  constructor(
    @Self() elementRef: ElementRef,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private sortService: FuiDatagridSortService,
    private resizeService: FuiDatagridResizeService,
    private eventService: FuiDatagridEventService,
    private columnKeyCreator: ColumnKeyCreator,
    public column: Column,
    dragAndDropService: FuiDatagridDragAndDropService,
    columnService: FuiColumnService,
    gridPanel: FuiDatagridService
  ) {
    super(gridPanel.eHeaderViewport, dragAndDropService, columnService, gridPanel);
    this.element = elementRef.nativeElement;
  }

  get colIndex(): number {
    return this._colIndex;
  }

  @Input()
  set colIndex(value: number) {
    this._colIndex = value;
    this.cd.markForCheck();
  }

  get columns(): Array<Column> {
    return this._columns;
  }

  @Input()
  set columns(value: Array<Column>) {
    this._columns = value;
    this.cd.markForCheck();
  }

  get rowHeight(): number {
    return this._rowHeight;
  }

  @Input()
  set rowHeight(value: number) {
    this._rowHeight = value;
    this.cd.markForCheck();
  }

  @HostBinding('attr.role')
  get role(): string {
    return this._role;
  }

  set role(value: string) {
    this._role = value;
    this.cd.markForCheck();
  }

  @HostBinding('style.width.px')
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.cd.markForCheck();
  }

  @HostBinding('style.min-width.px')
  get minWidth(): number {
    return this._minWidth;
  }

  set minWidth(value: number) {
    this._minWidth = value;
    this.cd.markForCheck();
  }

  @HostBinding('style.max-width.px')
  get maxWidth(): number {
    return this._maxWidth;
  }

  set maxWidth(value: number) {
    this._maxWidth = value;
    this.cd.markForCheck();
  }

  @HostBinding('style.left.px')
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    this._left = value;
    this.cd.markForCheck();
  }

  @HostBinding('style.line-height.px')
  get lineHeight(): number {
    return this._lineHeight;
  }

  set lineHeight(value: number) {
    this._lineHeight = value;
    this.cd.markForCheck();
  }

  @HostBinding('class.sortable')
  get sortable(): boolean {
    return this._sortable;
  }

  set sortable(value: boolean) {
    this._sortable = value;
    this.cd.markForCheck();
  }

  ngOnInit(): void {
    // We update the Column.
    this.colId = this.columnKeyCreator.getUniqueKey(this.columnDefinition.colId, this.columnDefinition.field);
    this.column.initialise(this.columnDefinition, this.colId);
    this.column.colIndex = this.colIndex;
    this.column.nativeElement = this.element;

    this.sortable = this.columnDefinition.sortable;
    this.left = this.column.getLeft();
    this.width = this.column.getActualWidth();
    this.minWidth = this.column.getMinWidth();
    this.maxWidth = this.column.getMaxWidth();

    if (this.rowHeight) {
      this.lineHeight = this.rowHeight - 1;
    }
    this.subscriptions.push(
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_WIDTH_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.width = ev.column.getActualWidth();
          this.cd.markForCheck();
          this.resize.emit(ev);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_LEFT_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.left = ev.column.getLeft();
          this.cd.markForCheck();
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_VISIBLE_CHANGED).subscribe(columnEvent => {
        const ev: ColumnEvent = columnEvent as ColumnEvent;
        if (ev && ev.column.getColId() === this.column.getColId()) {
          this.changeVisibility.emit(ev);
        }
      }),
      this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SORT_COLUMN_CHANGED).subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.colIndex) {
      this.column.colIndex = changes.colIndex.currentValue;
      this.column.setOldLeft(this.column.getLeft());
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
    if (this.destroyFunctions.length > 0) {
      this.dragAndDropService.removeDropTarget(this);
      this.destroyFunctions.forEach(func => func());
    }
  }

  ngAfterViewInit(): void {
    this.setupMove(this.headerLabel.nativeElement, this.datagridHeaderText.nativeElement.innerText);
    this.setupResize(this.headerResize.nativeElement);
  }

  displayAscDescIcon(): FuiDatagridSortDirections {
    const hasCol = this.sortService.sortingColumns.findIndex(col => {
      return col.getColId() === this.column.getColId();
    });
    if (hasCol > -1 && this.column.getSort() === FuiDatagridSortDirections.ASC) {
      return FuiDatagridSortDirections.ASC;
    } else if (hasCol > -1 && this.column.getSort() === FuiDatagridSortDirections.DESC) {
      return FuiDatagridSortDirections.DESC;
    } else {
      return FuiDatagridSortDirections.NONE;
    }
  }

  isMultisort(): boolean {
    return this.sortService.isMultiSort();
  }

  onHeaderClick(event) {
    // If we can't sort this column, we just return void.
    if (!this.column.sortable) {
      return;
    }
    // TODO: Make the shift key a variable that can be change by the developer in grid definition.
    const eventKey = event.shiftKey;

    if (eventKey && !this.column.isSorted()) {
      this.column.sortOrder = this.sortService.getNextSortOrder();
    }
    const dirIndex: number = this.sortService.sortList().indexOf(this.column.getSort());
    // The sort order is asc, we want to get the next type of ordering when we click on the header
    this.column.setSort(this.sortService.getSortOrderByIndex(dirIndex === 2 ? 0 : dirIndex + 1));
    if (eventKey) {
      this.sortService.updateColumn(this.column);
    } else {
      this.sortService.resetColumnsSortOrder();
      this.sortService.setSortForOtherColumnThan(this.column, FuiDatagridSortDirections.NONE);
      this.sortService.sortingColumns = [this.column];
    }
  }

  isDragging() {
    return this.dragging;
  }

  private setupResize(eHeaderResizeCell: HTMLElement) {
    if (!this.column.isResizable()) {
      return;
    }

    if (eHeaderResizeCell) {
      const params: DatagridResizeParams = {
        eElement: eHeaderResizeCell,
        minWidth: this.minWidth,
        maxWidth: this.maxWidth,
        column: this.column,
        columnService: this.columnService,
      };
      this.resizeService.addResizeFor(params);
      this.addDestroyFunc(() => this.resizeService.removeResize());
    }
  }

  private setupMove(eHeaderCell: HTMLElement, displayName: string): void {
    const suppressMove = this.column.isLockPosition();

    if (suppressMove) {
      return;
    }

    if (eHeaderCell) {
      this.dragSource = {
        type: DragSourceType.HEADER,
        eElement: eHeaderCell,
        dragItemCallback: () => this.createDragItem(),
        dragItemName: displayName,
        dragSourceDropTarget: this,
        dragStarted: () => this.setColumnsMoving(true),
        dragStopped: () => this.setColumnsMoving(false),
      };
      this.dragAndDropService.addDragSource(this.dragSource, true);
      this.addDestroyFunc(() => this.dragAndDropService.removeDragSource(this.dragSource));
    }
  }

  private setColumnsMoving(value: boolean) {
    this.columnService.getVisibleColumns().forEach(column => {
      column.setMoving(value);
    });
    this.dragging = value;
    this.cd.markForCheck();
  }

  private createDragItem(): DragItem {
    const visibleState: { [key: string]: boolean } = {};
    visibleState[this.column.getId()] = this.column.isVisible();

    return {
      columns: [this.column],
      visibleState: visibleState,
    };
  }

  private addDestroyFunc(func: () => void): void {
    this.destroyFunctions.push(func);
  }
}
