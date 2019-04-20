import { Injectable } from '@angular/core';
import { FuiFormLayoutEnum } from '../layout.enum';

@Injectable()
export class FuiFormLayoutService {
  fuiFormLayoutEnum = FuiFormLayoutEnum;

  private _layout: FuiFormLayoutEnum = FuiFormLayoutEnum.DEFAULT;

  set layout(value: FuiFormLayoutEnum) {
    this._layout = value;
  }

  get layout(): FuiFormLayoutEnum {
    return this._layout;
  }
}
