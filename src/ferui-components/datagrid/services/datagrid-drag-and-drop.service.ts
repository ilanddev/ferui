import { Injectable, Renderer2 } from '@angular/core';
import { FuiDatagridOptionsWrapperService } from './datagrid-options-wrapper.service';
import { FuiDragEventsService } from './datagrid-drag-events.service';
import { DatagridUtils } from '../utils/datagrid-utils';
import { DragItem, DragListenerParams, DragSource, DropTarget, HDirection, VDirection } from '../types/drag-and-drop';
import { DraggingEvent } from '../events';
import { FuiDatagridService } from './datagrid.service';

@Injectable()
export class FuiDatagridDragAndDropService {
  public static ICON_MOVE = 'move';
  public static ICON_HIDE = 'hide';
  public static ICON_LEFT = 'left';
  public static ICON_RIGHT = 'right';

  private dragItem: DragItem;
  private eventLastTime: MouseEvent;
  private dragSource: DragSource;
  private dragging: boolean;

  private eGhost: HTMLElement;
  private eGhostParent: HTMLElement;
  private eGhostIcon: HTMLElement;
  private eGhostIcons: { [name: string]: HTMLElement };

  private dropTargets: DropTarget[] = [];
  private lastDropTarget: DropTarget;

  private dragSourceAndParamsList: { params: DragListenerParams; dragSource: DragSource }[] = [];

  constructor(
    private renderer: Renderer2,
    private gridOptionWrapper: FuiDatagridOptionsWrapperService,
    private dragService: FuiDragEventsService,
    private gridPanel: FuiDatagridService
  ) {}

  initIcons(icons: { [name: string]: HTMLElement }) {
    this.eGhostIcons = icons;
  }

  addDropTarget(dropTarget: DropTarget) {
    this.dropTargets.push(dropTarget);
  }

  addDragSource(dragSource: DragSource, allowTouch = false): void {
    const params: DragListenerParams = {
      eElement: dragSource.eElement,
      dragStartPixels: dragSource.dragStartPixels,
      onDragStart: this.onDragStart.bind(this, dragSource),
      onDragStop: this.onDragStop.bind(this),
      onDragging: this.onDragging.bind(this)
    };
    this.dragSourceAndParamsList.push({ params: params, dragSource: dragSource });
    this.dragService.addDragSource(params, allowTouch);
  }

  removeDragSource(dragSource: DragSource): void {
    const sourceAndParams = this.dragSourceAndParamsList.find(item => item.dragSource === dragSource);
    if (sourceAndParams) {
      this.dragService.removeDragSource(sourceAndParams.params);
      DatagridUtils.removeFromArray(this.dragSourceAndParamsList, sourceAndParams);
    }
  }

  removeDropTarget(dropTarget: DropTarget): void {
    if (dropTarget) {
      DatagridUtils.removeFromArray(this.dropTargets, dropTarget);
    }
  }

  setGhostIcon(iconName: string, shake = false): void {
    DatagridUtils.clearElement(this.eGhostIcon);
    if (iconName && this.eGhostIcons[iconName]) {
      this.renderer.appendChild(this.eGhostIcon, this.eGhostIcons[iconName]);
    } else {
      this.renderer.appendChild(this.eGhostIcon, this.eGhostIcons[FuiDatagridDragAndDropService.ICON_HIDE]);
    }
    if (shake) {
      this.renderer.addClass(this.eGhostIcon, 'fui-datagrid-shake-left-to-right');
    } else {
      this.renderer.removeClass(this.eGhostIcon, 'fui-datagrid-shake-left-to-right');
    }
  }

  createDropTargetEvent(
    dropTarget: DropTarget,
    event: MouseEvent,
    hDirection: HDirection,
    vDirection: VDirection,
    fromNudge: boolean
  ): DraggingEvent {
    // localise x and y to the target component
    const rect = dropTarget.getContainer().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return {
      event: event,
      x: x,
      y: y,
      vDirection: vDirection,
      hDirection: hDirection,
      dragSource: this.dragSource,
      fromNudge: fromNudge,
      dragItem: this.dragItem
    };
  }

  workOutHDirection(event: MouseEvent): HDirection {
    if (this.eventLastTime.clientX > event.clientX) {
      return HDirection.LEFT;
    } else if (this.eventLastTime.clientX < event.clientX) {
      return HDirection.RIGHT;
    } else {
      return null;
    }
  }

  workOutVDirection(event: MouseEvent): VDirection {
    if (this.eventLastTime.clientY > event.clientY) {
      return VDirection.UP;
    } else if (this.eventLastTime.clientY < event.clientY) {
      return VDirection.DOWN;
    } else {
      return null;
    }
  }

  private onDragStart(dragSource: DragSource, mouseEvent: MouseEvent): void {
    this.dragging = true;
    this.dragSource = dragSource;
    this.eventLastTime = mouseEvent;
    this.dragItem = this.dragSource.dragItemCallback();

    if (this.dragSource.dragStarted) {
      this.dragSource.dragStarted();
    }
    this.createGhost();
  }

  private onDragStop(mouseEvent: MouseEvent): void {
    this.eventLastTime = null;
    this.dragging = false;

    if (this.dragSource.dragStopped) {
      this.dragSource.dragStopped();
    }
    if (this.lastDropTarget && this.lastDropTarget.onDragStop) {
      const draggingEvent = this.createDropTargetEvent(this.lastDropTarget, mouseEvent, null, null, false);
      this.lastDropTarget.onDragStop(draggingEvent);
    }
    this.lastDropTarget = null;
    this.dragItem = null;
    this.removeGhost();
  }

  private onDragging(mouseEvent: MouseEvent, fromNudge: boolean): void {
    const hDirection = this.workOutHDirection(mouseEvent);
    const vDirection = this.workOutVDirection(mouseEvent);

    this.eventLastTime = mouseEvent;

    this.positionGhost(mouseEvent);

    // check if mouseEvent intersects with any of the drop targets
    const dropTarget = this.dropTargets.find(target => {
      return this.isMouseOnDropTarget(mouseEvent, target);
    });
    if (dropTarget !== this.lastDropTarget) {
      this.leaveLastTargetIfExists(mouseEvent, hDirection, vDirection, fromNudge);
      this.enterDragTargetIfExists(dropTarget, mouseEvent, hDirection, vDirection, fromNudge);
      this.lastDropTarget = dropTarget;
    } else if (dropTarget) {
      const draggingEvent = this.createDropTargetEvent(dropTarget, mouseEvent, hDirection, vDirection, fromNudge);
      dropTarget.onDragging(draggingEvent);
    }
  }

  private enterDragTargetIfExists(
    dropTarget: DropTarget,
    mouseEvent: MouseEvent,
    hDirection: HDirection,
    vDirection: VDirection,
    fromNudge: boolean
  ): void {
    if (!dropTarget) {
      return;
    }

    const dragEnterEvent = this.createDropTargetEvent(dropTarget, mouseEvent, hDirection, vDirection, fromNudge);
    dropTarget.onDragEnter(dragEnterEvent);
    this.setGhostIcon(dropTarget.getIconName ? dropTarget.getIconName() : null);
  }

  private leaveLastTargetIfExists(
    mouseEvent: MouseEvent,
    hDirection: HDirection,
    vDirection: VDirection,
    fromNudge: boolean
  ): void {
    if (!this.lastDropTarget) {
      return;
    }

    const dragLeaveEvent = this.createDropTargetEvent(this.lastDropTarget, mouseEvent, hDirection, vDirection, fromNudge);
    this.lastDropTarget.onDragLeave(dragLeaveEvent);
    this.setGhostIcon(null);
  }

  private isMouseOnDropTarget(mouseEvent: MouseEvent, dropTarget: DropTarget): boolean {
    const allContainers = this.getAllContainersFromDropTarget(dropTarget);

    let mouseOverTarget: boolean = false;
    allContainers.forEach((eContainer: HTMLElement) => {
      if (!eContainer) {
        return;
      } // secondary can be missing
      const rect = eContainer.getBoundingClientRect();

      // if element is not visible, then width and height are zero
      if (rect.width === 0 || rect.height === 0) {
        return;
      }
      const horizontalFit = mouseEvent.clientX >= rect.left && mouseEvent.clientX <= rect.right;
      const verticalFit = mouseEvent.clientY >= rect.top && mouseEvent.clientY <= rect.bottom;

      if (horizontalFit && verticalFit) {
        mouseOverTarget = true;
      }
    });

    if (mouseOverTarget) {
      return dropTarget.isInterestedIn(this.dragSource.type);
    } else {
      return false;
    }
  }

  private getAllContainersFromDropTarget(dropTarget: DropTarget): HTMLElement[] {
    let containers = [dropTarget.getContainer()];
    const secondaryContainers = dropTarget.getSecondaryContainers ? dropTarget.getSecondaryContainers() : null;
    if (secondaryContainers) {
      containers = containers.concat(secondaryContainers);
    }
    return containers;
  }

  private removeGhost(): void {
    if (this.eGhost && this.eGhostParent) {
      this.renderer.removeChild(this.eGhostParent, this.eGhost);
    }
    this.eGhost = null;
  }

  private createGhost() {
    this.eGhost = this.renderer.createElement('div');
    this.renderer.addClass(this.eGhost, 'fui-datagrid-dragger');
    this.renderer.setStyle(this.eGhost, 'height', `${this.gridOptionWrapper.gridOptions.rowHeight}px`);
    this.renderer.setStyle(this.eGhost, 'line-height', `${this.gridOptionWrapper.gridOptions.rowHeight - 1}px`);

    this.eGhostIcon = this.renderer.createElement('div');
    this.renderer.addClass(this.eGhostIcon, 'fui-datagrid-dragger-icon');
    this.setGhostIcon(null);
    this.renderer.appendChild(this.eGhost, this.eGhostIcon);

    const eGhostLabel = this.renderer.createElement('div');
    const text = this.renderer.createText(this.dragSource.dragItemName());
    this.renderer.addClass(eGhostLabel, 'fui-datagrid-dragger-label');
    this.renderer.appendChild(eGhostLabel, text);
    this.renderer.appendChild(this.eGhost, eGhostLabel);

    this.eGhostParent = document.body;
    this.renderer.appendChild(this.eGhostParent, this.eGhost);
  }

  private positionGhost(event: MouseEvent): void {
    const ghostRect = this.eGhost.getBoundingClientRect();

    const windowScrollY = DatagridUtils.getWindowSrollY();
    const windowScrollX = DatagridUtils.getWindowSrollX();

    const ghostWidth: number = ghostRect.width;
    const ghostHeight = ghostRect.height;
    const ghostTopCurrent = event.pageY - ghostHeight / 3 - windowScrollY;
    const ghostLeftCurrent = event.pageX - ghostWidth / 2 - windowScrollX;

    let ghostTop = ghostTopCurrent;
    let ghostLeft = ghostLeftCurrent;

    const maxTopOffset = Math.round(this.gridPanel.eHeaderRoot.getBoundingClientRect().top as number);
    const maxLeftOffset = Math.round(this.gridPanel.eHeaderRoot.getBoundingClientRect().left as number);
    const maxRightOffset = Math.round(this.gridPanel.eHeaderRoot.getBoundingClientRect().right as number);
    const maxBottomOffset = Math.round(this.gridPanel.eBodyViewport.getBoundingClientRect().bottom as number);

    const ghostLeftMax = maxLeftOffset + 5;
    const ghostTopMax = maxTopOffset + 5;
    const ghostBottomMax = maxBottomOffset - (ghostHeight + 5);
    const ghostRightMax = maxRightOffset - (ghostWidth + 5);
    if (ghostTop < ghostTopMax) {
      ghostTop = ghostTopMax;
    }
    if (ghostLeft < ghostLeftMax) {
      ghostLeft = ghostLeftMax;
    }
    if (ghostTop > ghostBottomMax) {
      ghostTop = ghostBottomMax;
    }
    if (ghostLeft > ghostRightMax) {
      ghostLeft = ghostRightMax;
    }

    // Set top/left values for the ghost template.
    this.renderer.setStyle(this.eGhost, 'top', `${ghostTop}px`);
    this.renderer.setStyle(this.eGhost, 'left', `${ghostLeft}px`);
  }
}
