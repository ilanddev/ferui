import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FuiTextarea } from './textarea';
import { FuiTextareaContainer } from './textarea-container';

import { ContainerNoLabelSpec, TemplateDrivenSpec, ReactiveSpec } from '../tests/container.spec';

@Component({
  template: `
    <fui-textarea-container>
      <textarea name="test" fuiTextarea required [(ngModel)]="model" [disabled]="disabled"></textarea>
      <label>Hello World</label>
      <fui-control-error>This field is required</fui-control-error>
    </fui-textarea-container>
  `,
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <fui-textarea-container>
      <textarea fuiTextarea [(ngModel)]="model"></textarea>
    </fui-textarea-container>`,
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <fui-textarea-container>
        <textarea name="test" required fuiTextarea formControlName="model"></textarea>
        <label>Hello World</label>
        <fui-control-error>This field is required</fui-control-error>
      </fui-textarea-container>
    </form>`,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

export default function(): void {
  describe('FuiTextareaContainer', () => {
    ContainerNoLabelSpec(FuiTextareaContainer, FuiTextarea, NoLabelTest);
    TemplateDrivenSpec(FuiTextareaContainer, FuiTextarea, SimpleTest, '.fui-textarea-wrapper [fuiTextarea]');
    ReactiveSpec(FuiTextareaContainer, FuiTextarea, ReactiveTest, '.fui-textarea-wrapper [fuiTextarea]');
  });
}
