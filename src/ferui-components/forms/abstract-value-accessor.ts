import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';

export abstract class AbstractValueAccessor<T> implements ControlValueAccessor {

  /**
   * Holds the current value of the form component
   */
  _value: T = '';

  get value(): T {
    return this._value;
  };

  set value(v: T) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  writeValue(value: T) {
    this._value = value;
    this.onChange(value);
  }

  /**
   * Invoked when the model has been changed
   */
  onChange: (_: any) => void = (_: any) => {
  };

  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => {
  };

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
    this.onChange(this.value);
  }

  /**
   * Writes a new item to the element.
   * @param value the value
   */
  writeValue(value: T): void {
    this.value = value;
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

export function MakeProvider(type: any) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => type),
    multi: true
  };
}
