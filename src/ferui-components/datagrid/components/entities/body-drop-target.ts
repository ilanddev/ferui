import { DragSourceType, DropListener, DropTarget, DropType } from '../../types/drag-and-drop';
import { DraggingEvent } from '../../events';
import { FuiDatagridDragAndDropService } from '../../services/datagrid-drag-and-drop.service';
import { FuiColumnDropListener } from './column-drop-listener';
import { FuiColumnService } from '../../services/rendering/column.service';
import { FuiDatagridService } from '../../services/datagrid.service';

export class FuiDatagridBodyDropTarget implements DropTarget {
  private eSecondaryContainers: HTMLElement[];

  private currentDropListener: DropListener;

  private moveColumnDropListener: FuiColumnDropListener;

  private dropListeners: { [type: number]: DropListener } = {};

  constructor(
    private eContainer: HTMLElement,
    protected dragAndDropService: FuiDatagridDragAndDropService,
    protected columnService: FuiColumnService,
    protected gridPanel: FuiDatagridService
  ) {
    this.init();
  }

  init() {
    this.moveColumnDropListener = new FuiColumnDropListener(this.dragAndDropService, this.columnService, this.gridPanel);
    this.dropListeners[DropType.COLUMN_MOVE] = this.moveColumnDropListener;
    this.dragAndDropService.addDropTarget(this);
    this.eSecondaryContainers = this.gridPanel.getDropTargetBodyContainers();
  }

  isInterestedIn(type: DragSourceType): boolean {
    // not interested in row drags
    return type === DragSourceType.HEADER;
  }

  getSecondaryContainers(): HTMLElement[] {
    return this.eSecondaryContainers;
  }

  getContainer(): HTMLElement {
    return this.eContainer;
  }

  getIconName(): string {
    return this.currentDropListener.getIconName();
  }

  onDragEnter(draggingEvent: DraggingEvent): void {
    // we pick the drop listener.
    // we change visibility state and position.
    const dropType: DropType = this.getDropType(draggingEvent);
    this.currentDropListener = this.dropListeners[dropType];
    this.currentDropListener.onDragEnter(draggingEvent);
  }

  onDragLeave(params: DraggingEvent): void {
    this.currentDropListener.onDragLeave(params);
  }

  onDragging(params: DraggingEvent): void {
    this.currentDropListener.onDragging(params);
  }

  onDragStop(params: DraggingEvent): void {
    this.currentDropListener.onDragStop(params);
  }

  getDropType(draggingEvent: DraggingEvent): DropType {
    // it's a column, and not pivot mode, so always moving
    return DropType.COLUMN_MOVE;
  }
}
