import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FuiTextarea } from './textarea';
import { FuiTextareaContainer } from './textarea-container';

import { TemplateDrivenSpec, ControlStandaloneSpec, ReactiveSpec } from '../tests/control.spec';

@Component({
  template: `
    <textarea fuiTextarea></textarea>
  `
})
class StandaloneUseTest {}

@Component({
  template: `
    <textarea fuiTextarea name="model" class="test-class" [(ngModel)]="model"></textarea>
  `
})
class TemplateDrivenTest {}

@Component({
  template: `
    <div [formGroup]="example">
      <textarea fuiTextarea name="model" class="test-class" formControlName="model"></textarea>
    </div>
  `
})
class ReactiveTest {
  example = new FormGroup({
    model: new FormControl('', Validators.required)
  });
}

export default function(): void {
  describe('Textarea directive', () => {
    ControlStandaloneSpec(StandaloneUseTest);
    TemplateDrivenSpec(FuiTextareaContainer, FuiTextarea, TemplateDrivenTest, 'fui-textarea');
    ReactiveSpec(FuiTextareaContainer, FuiTextarea, ReactiveTest, 'fui-textarea');
  });
}
