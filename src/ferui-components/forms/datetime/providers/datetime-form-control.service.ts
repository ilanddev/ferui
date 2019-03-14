import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FuiDatetimeModelTypes } from '../../common/datetime-model-types.enum';

@Injectable()
export class DatetimeFormControlService {
  private _modelTypeChange: Subject<FuiDatetimeModelTypes> = new Subject<FuiDatetimeModelTypes>();

  get modelTypeChange(): Observable<FuiDatetimeModelTypes> {
    return this._modelTypeChange.asObservable();
  }

  setModelType(modelType: FuiDatetimeModelTypes): void {
    this._modelTypeChange.next(modelType);
  }
}
