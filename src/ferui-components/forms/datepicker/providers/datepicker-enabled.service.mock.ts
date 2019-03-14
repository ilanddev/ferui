import { Injectable } from '@angular/core';
import { DatepickerEnabledService } from './datepicker-enabled.service';

@Injectable()
export class MockDatepickerEnabledService extends DatepickerEnabledService {
  fakeIsEnabled: boolean = true;

  get isEnabled(): boolean {
    return this.fakeIsEnabled;
  }
}
