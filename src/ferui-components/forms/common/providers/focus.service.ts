import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class FocusService {
  private _focused: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get focusChange(): Observable<boolean> {
    return this._focused.asObservable();
  }
  set focused(state: boolean) {
    this._focused.next(state);
  }
}
