import { Component } from '@angular/core';

import { WrapperFullSpec, WrapperNoLabelSpec, WrapperContainerSpec } from '../tests/wrapper.spec';
import { FuiCheckboxContainer } from './checkbox-container';
import { FuiCheckbox } from './checkbox';
import { FuiCheckboxWrapper } from './checkbox-wrapper';

@Component({
  template: `
    <fui-checkbox-wrapper>
      <label>Hello World</label>
      <input type="checkbox" fuiCheckbox name="model" [(ngModel)]="model" />
    </fui-checkbox-wrapper>
  `
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <fui-checkbox-wrapper>
      <input type="checkbox" fuiCheckbox name="model" [(ngModel)]="model" />
    </fui-checkbox-wrapper>
  `
})
class NoLabelTest {
  model = '';
}

@Component({
  template: `
    <fui-checkbox-container>
      <fui-checkbox-wrapper>
        <input type="checkbox" fuiCheckbox name="model" [(ngModel)]="model" />
      </fui-checkbox-wrapper>
    </fui-checkbox-container>
  `
})
class ContainerTest {
  model = '';
}

export default function(): void {
  describe('FuiCheckboxWrapper', () => {
    WrapperNoLabelSpec(FuiCheckboxWrapper, FuiCheckbox, NoLabelTest);
    WrapperFullSpec(FuiCheckboxWrapper, FuiCheckbox, FullTest, 'fui-checkbox-wrapper');
    WrapperContainerSpec(FuiCheckboxContainer, FuiCheckboxWrapper, FuiCheckbox, ContainerTest, 'fui-checkbox-wrapper');
  });
}
