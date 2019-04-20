import { Injectable } from '@angular/core';
import { FuiDatagridEvent } from '../events';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FuiDatagridEventService {
  private listeners: { [key: string]: Subject<FuiDatagridEvent> } = {};

  listenToEvent(eventType: string): Observable<FuiDatagridEvent> | null {
    if (!this.listeners.hasOwnProperty(eventType)) {
      this.listeners[eventType] = new Subject<FuiDatagridEvent>();
    }
    return this.listeners[eventType].asObservable();
  }

  dispatchEvent(event: FuiDatagridEvent): void {
    if (!event) {
      return;
    }
    if (!this.listeners.hasOwnProperty(event.type)) {
      this.listeners[event.type] = new Subject<FuiDatagridEvent>();
    }
    this.listeners[event.type].next(event);
  }

  flushListeners(): void {
    this.listeners = {};
  }
}
