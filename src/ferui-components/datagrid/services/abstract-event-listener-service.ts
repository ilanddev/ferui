import { Observable, Subject } from 'rxjs';
import { DatagridEvent } from '../events';

export abstract class AbstractEventListenerService {
  private _events: Subject<DatagridEvent> = new Subject<DatagridEvent>();

  get events(): Observable<DatagridEvent> {
    return this._events.asObservable();
  }

  protected emitEvent(event: DatagridEvent): void {
    this._events.next(event);
  }
}
