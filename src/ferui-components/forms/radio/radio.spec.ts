import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ControlStandaloneSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/control.spec';
import { FuiRadio } from './radio';
import { FuiRadioWrapper } from './radio-wrapper';

@Component({
  template: `
    <input type="radio" fuiRadio />
  `
})
class StandaloneUseTest {}

@Component({
  template: `
    <input type="radio" fuiRadio name="model" class="test-class" [(ngModel)]="model" />
  `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <form [formGroup]="example">
      <input type="radio" fuiRadio name="model" class="test-class" formControlName="model" />
    </form>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function(): void {
  describe('FuiRadio directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiRadioWrapper, FuiRadio, TemplateDrivenTest, 'fui-radio');
    ReactiveSpec(FuiRadioWrapper, FuiRadio, ReactiveTest, 'fui-radio');
  });
}
