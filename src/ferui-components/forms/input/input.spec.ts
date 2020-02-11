import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TemplateDrivenSpec, ControlStandaloneSpec, ReactiveSpec } from '../tests/control.spec';
import { FuiInputContainer } from './input-container';
import { FuiInput } from './input';

@Component({
  template: `
    <input type="text" fuiInput />
  `
})
class StandaloneUseTest {}

@Component({
  template: `
    <input fuiInput name="model" class="test-class" [(ngModel)]="model" />
  `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <input fuiInput name="model" class="test-class" formControlName="model" />
    </div>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function(): void {
  describe('Input directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiInputContainer, FuiInput, TemplateDrivenTest, 'fui-input');
    ReactiveSpec(FuiInputContainer, FuiInput, ReactiveTest, 'fui-input');
  });
}
