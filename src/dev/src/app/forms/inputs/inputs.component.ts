import { Component } from '@angular/core';

@Component({
  templateUrl: './inputs.component.html'
})
export class InputsComponent {
  disabled = true;
  inputs = {
    one: '',
    two: 'Filled with value',
    three: '',
    four: '',
    five: 'Disabled with value'
  };
}
