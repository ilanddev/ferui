import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TimeModel } from '../models/time.model';

@Injectable()
export class TimeSelectionService {
  selectedTime: TimeModel;

  private _selectedTimeChange: Subject<TimeModel> = new Subject<TimeModel>();
  get selectedTimeChange(): Observable<TimeModel> {
    return this._selectedTimeChange.asObservable();
  }

  notifySelectedTime(timeModel: TimeModel) {
    if (timeModel && timeModel.isEqual(this.selectedTime)) {
      return;
    }
    this.selectedTime = timeModel;
    this._selectedTimeChange.next(timeModel);
  }
}
