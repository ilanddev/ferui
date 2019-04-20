import { Injectable } from '@angular/core';
import { FuiSelect } from './select';
import { FuiSelectContainer } from './select-container';

@Injectable()
export class FuiSelectService {
  private _fuiSelect: FuiSelect;
  private _fuiSelectContainer: FuiSelectContainer;

  constructor() {}

  get fuiSelect(): FuiSelect {
    return this._fuiSelect;
  }

  set fuiSelect(value: FuiSelect) {
    this._fuiSelect = value;
  }

  get fuiSelectContainer(): FuiSelectContainer {
    return this._fuiSelectContainer;
  }

  set fuiSelectContainer(value: FuiSelectContainer) {
    this._fuiSelectContainer = value;
  }
}
