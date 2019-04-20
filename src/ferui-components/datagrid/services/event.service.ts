import { Injectable } from '@angular/core';
import { DatagridEvent } from '../events';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FuiDatagridEventService {
  private listeners: { [key: string]: Subject<DatagridEvent> } = {};

  listenToEvent(eventType: string): Observable<DatagridEvent> | null {
    if (!this.listeners.hasOwnProperty(eventType)) {
      this.listeners[eventType] = new Subject<DatagridEvent>();
    }
    return this.listeners[eventType].asObservable();
  }

  dispatchEvent(event: DatagridEvent): void {
    if (!event) {
      return;
    }
    if (!this.listeners.hasOwnProperty(event.type)) {
      this.listeners[event.type] = new Subject<DatagridEvent>();
    }
    this.listeners[event.type].next(event);
  }

  flushListeners(): void {
    for (const listenersKey in this.listeners) {
      if (this.listeners.hasOwnProperty(listenersKey)) {
        this.listeners[listenersKey].unsubscribe();
      }
    }
    this.listeners = {};
  }
}
