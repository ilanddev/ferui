import { Injectable } from '@angular/core';
import { FeruiUtils } from '../../../utils/ferui-utils';

@Injectable()
export class NumberIoService {
  private _min: number;
  private _max: number;
  private _step: number = 1;
  private _currentValue: number = 0;

  get min(): number {
    return this._min;
  }

  set min(value: number) {
    this._min = value;
  }

  get max(): number {
    return this._max;
  }

  set max(value: number) {
    this._max = value;
  }

  get step(): number {
    return this._step;
  }

  set step(value: number) {
    this._step = value;
  }

  get currentValue(): number {
    return this._currentValue;
  }

  set currentValue(value: number) {
    this._currentValue = value;
  }

  increment(): number {
    const initialValue: number = this.currentValue;
    if (
      (FeruiUtils.isNullOrUndefined(this.min) && FeruiUtils.isNullOrUndefined(this.max)) ||
      (!FeruiUtils.isNullOrUndefined(this.min) &&
        !FeruiUtils.isNullOrUndefined(this.max) &&
        initialValue + this.step >= this.min &&
        initialValue + this.step <= this.max)
    ) {
      this.currentValue = initialValue + this.step;
    }
    return this.currentValue;
  }

  decrement(): number {
    const initialValue: number = this.currentValue;
    if (
      (FeruiUtils.isNullOrUndefined(this.min) && FeruiUtils.isNullOrUndefined(this.max)) ||
      (!FeruiUtils.isNullOrUndefined(this.min) &&
        !FeruiUtils.isNullOrUndefined(this.max) &&
        initialValue - this.step >= this.min &&
        initialValue - this.step <= this.max)
    ) {
      this.currentValue = initialValue - this.step;
    }
    return this.currentValue;
  }
}
