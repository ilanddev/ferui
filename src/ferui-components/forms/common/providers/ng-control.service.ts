import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NgControlService {
  // Observable to subscribe to the control, since its not available immediately for projected content
  private _controlChanges: Subject<NgControl> = new Subject<NgControl>();
  get controlChanges(): Observable<NgControl> {
    return this._controlChanges.asObservable();
  }

  setControl(control: NgControl) {
    this._controlChanges.next(control);
  }
}
