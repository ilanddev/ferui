import { Injectable, Optional, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class RootDropdownService {
  private _changes: Subject<boolean> = new Subject<boolean>();

  get changes(): Observable<boolean> {
    return this._changes.asObservable();
  }

  closeMenus(): void {
    this._changes.next(false);
  }
}

export function fuiRootDropdownFactory(existing: RootDropdownService) {
  return existing || new RootDropdownService();
}

export const ROOT_DROPDOWN_PROVIDER = {
  provide: RootDropdownService,
  useFactory: fuiRootDropdownFactory,
  deps: [[new Optional(), new SkipSelf(), RootDropdownService]],
};
