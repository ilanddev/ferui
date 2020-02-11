import { Component } from '@angular/core';

import { WrapperFullSpec, WrapperNoLabelSpec, WrapperContainerSpec } from '../tests/wrapper.spec';
import { FuiRadioWrapper } from './radio-wrapper';
import { FuiRadio } from './radio';
import { FuiRadioContainer } from './radio-container';

@Component({
  template: `
    <fui-radio-wrapper>
      <label>Hello World</label>
      <input type="radio" fuiRadio name="model" [(ngModel)]="model" />
    </fui-radio-wrapper>
  `
})
class FullTest {
  model = '';
}

@Component({
  template: `
    <fui-radio-wrapper>
      <input type="radio" fuiRadio name="model" [(ngModel)]="model" />
    </fui-radio-wrapper>
  `
})
class NoLabelTest {
  model = '';
}

@Component({
  template: `
    <fui-radio-container>
      <fui-radio-wrapper>
        <input type="radio" fuiRadio name="model" [(ngModel)]="model" />
      </fui-radio-wrapper>
    </fui-radio-container>
  `
})
class ContainerTest {
  model = '';
}

export default function(): void {
  describe('FuiRadioWrapper', () => {
    WrapperNoLabelSpec(FuiRadioWrapper, FuiRadio, NoLabelTest);
    WrapperFullSpec(FuiRadioWrapper, FuiRadio, FullTest, 'fui-radio-wrapper');
    WrapperContainerSpec(FuiRadioContainer, FuiRadioWrapper, FuiRadio, ContainerTest, 'fui-radio-wrapper');
  });
}
