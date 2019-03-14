import { Injectable } from '@angular/core';
import { FocusTrapDirective } from './focus-trap.directive';

@Injectable({ providedIn: 'root' })
export class FocusTrapTracker {
  private _previousFocusTraps: FocusTrapDirective[] = [];
  private _current: FocusTrapDirective;

  get current(): FocusTrapDirective {
    return this._current;
  }

  set current(value: FocusTrapDirective) {
    this._previousFocusTraps.push(this._current);
    this._current = value;
  }

  get nbFocusTrappers(): number {
    return this._previousFocusTraps.length;
  }

  activatePreviousTrapper() {
    this._current = this._previousFocusTraps.pop();
  }
}
