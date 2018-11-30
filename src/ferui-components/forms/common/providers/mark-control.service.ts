import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MarkControlService {
  private _dirty: Subject<void> = new Subject();

  get dirtyChange(): Observable<void> {
    return this._dirty.asObservable();
  }

  markAsDirty() {
    this._dirty.next();
  }
}
