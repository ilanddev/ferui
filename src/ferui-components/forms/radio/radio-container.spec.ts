import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ContainerNoLabelSpec, TemplateDrivenSpec, ReactiveSpec } from '../tests/container.spec';
import { FuiRadioContainer } from './radio-container';
import { FuiRadioWrapper } from './radio-wrapper';
import { FuiRadio } from './radio';

@Component({
  template: `
    <fui-radio-container></fui-radio-container>
  `
})
class NoLabelTest {}

@Component({
  template: `
    <fui-radio-container>
      <label>Hello World</label>
      <fui-radio-wrapper>
        <label>One</label>
        <input type="radio" fuiRadio name="model" required [(ngModel)]="model" value="one" />
      </fui-radio-wrapper>
      <fui-radio-wrapper>
        <label>Two</label>
        <input type="radio" fuiRadio name="model" required [(ngModel)]="model" value="two" [disabled]="disabled" />
      </fui-radio-wrapper>
      <fui-control-error>There was an error</fui-control-error>
    </fui-radio-container>
  `
})
class TemplateDrivenTest {
  inline = false;
  disabled = false;
  model = '';
}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-radio-container>
        <label>Hello World</label>
        <fui-radio-wrapper>
          <label>One</label>
          <input fuiRadio type="radio" formControlName="model" value="one" />
        </fui-radio-wrapper>
        <fui-radio-wrapper>
          <label>Two</label>
          <input fuiRadio type="radio" formControlName="model" value="two" />
        </fui-radio-wrapper>
        <fui-control-error>There was an error</fui-control-error>
      </fui-radio-container>
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
  describe('FuiRadioContainer', () => {
    ContainerNoLabelSpec(FuiRadioContainer, [FuiRadio, FuiRadioWrapper], NoLabelTest);
    TemplateDrivenSpec(FuiRadioContainer, [FuiRadio, FuiRadioWrapper], TemplateDrivenTest, '.fui-radio-wrapper [fuiRadio]');
    ReactiveSpec(FuiRadioContainer, [FuiRadio, FuiRadioWrapper], ReactiveTest, '.fui-radio-wrapper [fuiRadio]');
  });
}
