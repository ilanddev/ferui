import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { FuiDatagridOptionsWrapperService } from './datagrid-options-wrapper.service';
import { DatagridUtils } from '../utils/datagrid-utils';
import { DragEvent, FuiDatagridEvents } from '../events';
import { FuiDatagridApiService } from './datagrid-api.service';
import { FuiDatagridColumnApiService } from './datagrid-column-api.service';
import { takeUntil } from 'rxjs/operators';
import { DragListenerParams, DragSourceAndListener } from '../types/drag-and-drop';

@Injectable()
export class FuiDragEventsService {
  // The Observable that lets other classes subscribe to sort changes
  private _change = new Subject<DragEvent>();

  private currentDragParams: DragListenerParams;
  private dragging: boolean;
  private mouseEventLastTime: MouseEvent;
  private mouseStartEvent: MouseEvent;
  private touchLastTime: Touch;
  private touchStart: Touch;

  private dragEndFunctions: Function[] = [];

  private dragSources: DragSourceAndListener[] = [];

  constructor(
    private gridOptionsWrapper: FuiDatagridOptionsWrapperService,
    private gridApi: FuiDatagridApiService,
    private columnApi: FuiDatagridColumnApiService
  ) {}

  destroy(): void {
    this.dragSources.forEach(dragSource => {
      this.removeListener(dragSource);
    });
  }

  addDragSource(params: DragListenerParams, includeTouch: boolean = false): void {
    // Setup the mouse down event on the drag element.
    const mouseDownEvent = fromEvent(params.eElement, 'mousedown');
    const mouseListener = mouseDownEvent.subscribe((ev: MouseEvent) => this.onMouseDown(params, ev));

    // If we are on mobile, then we use the touch event
    let touchListener: Subscription = null;
    let touchStartEvent: Observable<Event>;

    const suppressTouch = this.gridOptionsWrapper.isSuppressTouch();

    if (includeTouch && !suppressTouch) {
      touchStartEvent = fromEvent(params.eElement, 'touchstart', { passive: false });
      touchListener = touchStartEvent.subscribe((ev: TouchEvent) => this.onTouchStart(params, ev));
    }

    this.dragSources.push({
      dragSource: params,
      mouseDownListener: mouseListener,
      mouseDownEvent: mouseDownEvent,
      touchStartListener: touchListener,
      touchStartEvent: touchStartEvent,
      touchEnabled: includeTouch
    });
  }

  public removeDragSource(params: DragListenerParams): void {
    const dragSourceAndListener = this.dragSources.find(item => item.dragSource === params);

    if (!dragSourceAndListener) {
      return;
    }

    this.removeListener(dragSourceAndListener);
    DatagridUtils.removeFromArray(this.dragSources, dragSourceAndListener);
  }

  private onMouseDown(params: DragListenerParams, mouseEvent: MouseEvent) {
    if (params.skipMouseEvent) {
      if (params.skipMouseEvent(mouseEvent)) {
        return;
      }
    }
    if ((mouseEvent as any)._alreadyProcessedByDragService) {
      return;
    }
    (mouseEvent as any)._alreadyProcessedByDragService = true;

    // only interested in left button clicks
    if (mouseEvent.button !== 0) {
      return;
    }

    this.currentDragParams = params;
    this.dragging = false;

    this.mouseEventLastTime = mouseEvent;
    this.mouseStartEvent = mouseEvent;

    const mouseUpEvent = fromEvent(document, 'mouseup');
    const mouseUpListener = mouseUpEvent.subscribe((ev: MouseEvent) => this.onMouseUp(ev));

    const mouseMoveListener = fromEvent(document, 'mousemove')
      .pipe(takeUntil(mouseUpEvent))
      .subscribe((ev: MouseEvent) => this.onMouseMove(ev));

    this.dragEndFunctions.push(() => {
      mouseMoveListener.unsubscribe();
      mouseUpListener.unsubscribe();
    });

    //see if we want to start dragging straight away
    if (params.dragStartPixels === 0) {
      this.onMouseMove(mouseEvent);
    }
  }

  private onMouseUp(mouseEvent: MouseEvent): void {
    this.onUpCommon(mouseEvent);
  }

  private onCommonMove(currentEvent: MouseEvent | Touch, startEvent: MouseEvent | Touch): void {
    if (!this.dragging) {
      // if mouse hasn't travelled from the start position enough, do nothing
      if (this.isEventNearStartEvent(currentEvent, startEvent)) {
        return;
      }

      this.dragging = true;
      const event: DragEvent = {
        type: FuiDatagridEvents.EVENT_DRAG_STARTED,
        api: this.gridApi,
        columnApi: this.columnApi
      };
      this.emitChange(event);
      this.currentDragParams.onDragStart(startEvent);
    }
    this.currentDragParams.onDragging(currentEvent);
  }

  private onUpCommon(eventOrTouch: MouseEvent | Touch): void {
    if (this.dragging) {
      this.dragging = false;
      this.currentDragParams.onDragStop(eventOrTouch);
      const event: DragEvent = {
        type: FuiDatagridEvents.EVENT_DRAG_STOPPED,
        api: this.gridApi,
        columnApi: this.columnApi
      };
      this.emitChange(event);
    }

    this.mouseStartEvent = null;
    this.mouseEventLastTime = null;
    this.touchStart = null;
    this.touchLastTime = null;
    this.currentDragParams = null;

    this.dragEndFunctions.forEach(func => func());
    this.dragEndFunctions.length = 0;
  }

  private onMouseMove(mouseEvent: MouseEvent): void {
    this.onCommonMove(mouseEvent, this.mouseStartEvent);
  }

  private onTouchStart(params: DragListenerParams, touchEvent: TouchEvent): void {
    this.currentDragParams = params;
    this.dragging = false;

    const touch = touchEvent.touches[0];

    this.touchLastTime = touch;
    this.touchStart = touch;

    touchEvent.preventDefault();

    // we temporally add these listeners, for the duration of the drag, they
    // are removed in touch end handling.
    const touchMoveListener = fromEvent(params.eElement, 'touchmove', { passive: true }).subscribe((ev: TouchEvent) =>
      this.onTouchMove(ev)
    );

    const toucEndListener = fromEvent(params.eElement, 'touchend', { passive: true }).subscribe((ev: TouchEvent) =>
      this.onTouchUp(ev)
    );

    const toucCancelListener = fromEvent(params.eElement, 'touchcancel', { passive: true }).subscribe((ev: TouchEvent) =>
      this.onTouchUp(ev)
    );

    this.dragEndFunctions.push(() => {
      touchMoveListener.unsubscribe();
      toucEndListener.unsubscribe();
      toucCancelListener.unsubscribe();
    });

    // see if we want to start dragging straight away
    if (params.dragStartPixels === 0) {
      this.onCommonMove(touch, this.touchStart);
    }
  }

  private onTouchUp(touchEvent: TouchEvent): void {
    let touch = this.getFirstActiveTouch(touchEvent.changedTouches);
    // i haven't worked this out yet, but there is no matching touch
    // when we get the touch up event. to get around this, we swap in
    // the last touch. this is a hack to 'get it working' while we
    // figure out what's going on, why we are not getting a touch in
    // current event.
    if (!touch) {
      touch = this.touchLastTime;
    }
    this.onUpCommon(touch);
  }

  private onTouchMove(touchEvent: TouchEvent) {
    const touch = this.getFirstActiveTouch(touchEvent.touches);
    if (!touch) {
      return;
    }

    this.onCommonMove(touch, this.touchStart);
  }

  // returns true if the event is close to the original event by X pixels either vertically or horizontally.
  // we only start dragging after X pixels so this allows us to know if we should start dragging yet.
  private isEventNearStartEvent(currentEvent: MouseEvent | Touch, startEvent: MouseEvent | Touch): boolean {
    // by default, we wait 4 pixels before starting the drag
    const { dragStartPixels } = this.currentDragParams;
    const requiredPixelDiff = dragStartPixels !== null && dragStartPixels !== undefined ? dragStartPixels : 4;
    return DatagridUtils.areEventsNear(currentEvent, startEvent, requiredPixelDiff);
  }

  private getFirstActiveTouch(touchList: TouchList): Touch {
    // Ignore Webstorm check for this for loop. TouchList is not a common Iterable, but it act like one.
    // so it's safe to loop over it.
    // tslint:disable-next-line
    for (let i = 0; i < touchList.length; i++) {
      if (touchList[i].identifier === this.touchStart.identifier) {
        return touchList[i];
      }
    }

    return null;
  }

  private removeListener(dragSourceAndListener: DragSourceAndListener): void {
    dragSourceAndListener.mouseDownListener.unsubscribe();
    if (dragSourceAndListener.touchEnabled) {
      dragSourceAndListener.touchStartListener.unsubscribe();
    }
  }

  // We do not want to expose the Subject itself, but the Observable which is read-only
  get change(): Observable<DragEvent> {
    return this._change.asObservable();
  }

  private emitChange(event: DragEvent) {
    this._change.next(event);
  }
}
