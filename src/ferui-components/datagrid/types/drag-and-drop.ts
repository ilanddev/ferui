import { Column } from '../components/entities/column';
import { DraggingEvent } from '../events';
import { Observable, Subscription } from 'rxjs';

export enum DropType {
  COLUMN_MOVE,
  PIVOT
}

export enum DragSourceType {
  HEADER,
  ROW
}

export interface DragListenerParams {
  /** After how many pixels of dragging should the drag operation start. Default is 4px. */
  dragStartPixels?: number;
  /** Dom element to add the drag handling to */
  eElement: HTMLElement;
  /** Some places may wish to ignore certain events, eg range selection ignores shift clicks */
  skipMouseEvent?: (mouseEvent: MouseEvent) => boolean;
  /** Callback for drag starting */
  onDragStart: (mouseEvent: MouseEvent | Touch) => void;
  /** Callback for drag stopping */
  onDragStop: (mouseEvent: MouseEvent | Touch) => void;
  /** Callback for mouse move while dragging */
  onDragging: (mouseEvent: MouseEvent | Touch) => void;
}

export interface DropListener {
  getIconName(): string;
  onDragEnter(params: DraggingEvent): void;
  onDragLeave(params: DraggingEvent): void;
  onDragging(params: DraggingEvent): void;
  onDragStop(params: DraggingEvent): void;
}

export interface DragSourceAndListener {
  dragSource: DragListenerParams;
  mouseDownListener: Subscription;
  mouseDownEvent: Observable<Event>;
  touchEnabled: boolean;
  touchStartListener: Subscription;
  touchStartEvent: Observable<Event>;
}

export interface DragItem {
  // if moving columns, this contains the columns and the visible state
  columns?: Column[];
  visibleState?: { [key: string]: boolean };
}

export interface DragSource {
  type: DragSourceType;
  /** Element which, when dragged, will kick off the DnD process */
  eElement: HTMLElement;
  /** If eElement is dragged, then the dragItem is the object that gets passed around. */
  dragItemCallback: () => DragItem;
  /** This name appears in the ghost icon when dragging */
  dragItemName: () => string | null;
  // The drop target associated with this dragSource. So when dragging starts, this target does not get
  // onDragEnter event.
  dragSourceDropTarget?: DropTarget;
  /** After how many pixels of dragging should the drag operation start. Default is 4px. */
  dragStartPixels?: number;
  /** Callback for drag started */
  dragStarted?: () => void;
  /** Callback for drag stopped */
  dragStopped?: () => void;
}

export interface DropTarget {
  /** The main container that will get the drop. */
  getContainer(): HTMLElement;

  // If any secondary containers. For example when moving columns in ag-Grid, we listen for drops
  // in the header as well as the body (main rows and pinned rows) of the grid.
  getSecondaryContainers?(): HTMLElement[];

  // Icon to show when drag is over
  getIconName?(): string;

  isInterestedIn(type: DragSourceType): boolean;

  /** Callback for when drag enters */
  onDragEnter?(params: DraggingEvent): void;

  /** Callback for when drag leaves */
  onDragLeave?(params: DraggingEvent): void;

  /** Callback for when dragging */
  onDragging?(params: DraggingEvent): void;

  /** Callback for when drag stops */
  onDragStop?(params: DraggingEvent): void;
}

export enum VDirection {
  UP,
  DOWN
}

export enum HDirection {
  LEFT,
  RIGHT
}
