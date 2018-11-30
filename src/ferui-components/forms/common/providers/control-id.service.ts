import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

let counter = 0;

@Injectable()
export class ControlIdService {
  private _id = 'fui-form-control-' + ++counter;
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    this._idChange.next(value);
  }

  private _idChange: BehaviorSubject<string> = new BehaviorSubject(this._id);
  public get idChange(): Observable<string> {
    return this._idChange.asObservable();
  }
}
