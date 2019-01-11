import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, TemplateDrivenSpec, ReactiveSpec } from '../tests/container.spec';
import { FuiCheckboxWrapper } from './checkbox-wrapper';
import { FuiCheckbox } from './checkbox';
import { FuiCheckboxContainer } from './checkbox-container';

@Component({
  template: `
    <fui-checkbox-container></fui-checkbox-container>
  `,
})
class NoLabelTest {}

@Component({
  template: `
    <fui-checkbox-container>
      <label>Hello World</label>
      <fui-checkbox-wrapper>
        <label>One</label>
        <input type="checkbox" fuiCheckbox name="model" required [(ngModel)]="model" value="one"/>
      </fui-checkbox-wrapper>
      <fui-checkbox-wrapper>
        <label>Two</label>
        <input type="checkbox" fuiCheckbox name="model" required [(ngModel)]="model" value="two" [disabled]="disabled"/>
      </fui-checkbox-wrapper>
      <fui-control-error>There was an error</fui-control-error>
    </fui-checkbox-container>
  `,
})
class TemplateDrivenTest {
  inline = false;
  disabled = false;
  model = '';
}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-checkbox-container>
        <label>Hello World</label>
        <fui-checkbox-wrapper>
          <label>One</label>
          <input fuiCheckbox type="checkbox" formControlName="model" value="one"/>
        </fui-checkbox-wrapper>
        <fui-checkbox-wrapper>
          <label>Two</label>
          <input fuiCheckbox type="checkbox" formControlName="model" value="two"/>
        </fui-checkbox-wrapper>
        <fui-control-error>There was an error</fui-control-error>
      </fui-checkbox-container>
    </form>`,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

export default function(): void {
  describe('FuiCheckboxContainer', () => {
    ContainerNoLabelSpec(FuiCheckboxContainer, [FuiCheckboxWrapper, FuiCheckbox], NoLabelTest);
    TemplateDrivenSpec(
      FuiCheckboxContainer,
      [FuiCheckboxWrapper, FuiCheckbox],
      TemplateDrivenTest,
      '.fui-checkbox-wrapper [fuiCheckbox]'
    );
    ReactiveSpec(
      FuiCheckboxContainer,
      [FuiCheckboxWrapper, FuiCheckbox],
      ReactiveTest,
      '.fui-checkbox-wrapper [fuiCheckbox]'
    );
  });
}
