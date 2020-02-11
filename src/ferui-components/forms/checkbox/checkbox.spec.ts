import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { FuiCheckbox } from './checkbox';
import { FuiCheckboxWrapper } from './checkbox-wrapper';

@Component({
  template: `
    <input type="checkbox" fuiCheckbox />
  `
})
class StandaloneUseTest {}

@Component({
  template: `
    <input type="checkbox" fuiCheckbox name="model" class="test-class" [(ngModel)]="model" />
  `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <form [formGroup]="example">
      <input type="checkbox" fuiCheckbox name="model" class="test-class" formControlName="model" />
    </form>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function(): void {
  describe('FuiCheckbox directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiCheckboxWrapper, FuiCheckbox, TemplateDrivenTest, 'fui-checkbox');
    ReactiveSpec(FuiCheckboxWrapper, FuiCheckbox, ReactiveTest, 'fui-checkbox');
  });
}
