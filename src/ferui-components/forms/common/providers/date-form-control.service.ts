import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class DateFormControlService {
  private _touchedChange: Subject<void> = new Subject<void>();

  get touchedChange(): Observable<void> {
    return this._touchedChange.asObservable();
  }

  private _dirtyChange: Subject<void> = new Subject<void>();

  get dirtyChange(): Observable<void> {
    return this._dirtyChange.asObservable();
  }

  markAsTouched(): void {
    this._touchedChange.next();
  }

  markAsDirty(): void {
    this._dirtyChange.next();
  }
}
