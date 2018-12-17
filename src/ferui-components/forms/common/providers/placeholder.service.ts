import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable()
export class PlaceholderService {
  private _placeholderChanges: Subject<string> = new Subject<string>();

  get placeholderChanges(): Observable<string> {
    return this._placeholderChanges.asObservable();
  }

  setPlaceholder(placeholder: string) {
    this._placeholderChanges.next(placeholder);
  }
}
