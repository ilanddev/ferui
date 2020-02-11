import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FuiInput } from './input';
import { FuiInputContainer } from './input-container';
import { TemplateDrivenSpec, ReactiveSpec, ContainerNoLabelSpec } from '../tests/container.spec';

@Component({
  template: `
    <fui-input-container>
      <input name="model" fuiInput required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <fui-control-error>This field is required</fui-control-error>
    </fui-input-container>
  `
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <fui-input-container>
      <input fuiInput name="model" [(ngModel)]="model" />
    </fui-input-container>
  `
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-input-container>
        <label>Hello World</label>
        <input fuiInput formControlName="model" />
        <fui-control-error>This field is required</fui-control-error>
      </fui-input-container>
    </form>
  `
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required)
  });
}

export default function(): void {
  describe('FuiInputContainer', () => {
    ContainerNoLabelSpec(FuiInputContainer, FuiInput, NoLabelTest);
    TemplateDrivenSpec(FuiInputContainer, FuiInput, SimpleTest, '.fui-input-wrapper [fuiInput]');
    ReactiveSpec(FuiInputContainer, FuiInput, ReactiveTest, '.fui-input-wrapper [fuiInput]');
  });
}
