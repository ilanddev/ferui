import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { ExampleCode } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { PASSWORD_EXAMPLES, PASSWORD_TEMPLATE } from './password.template';

@Component({
  template: PASSWORD_TEMPLATE,
})
export class PasswordComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: 'Filled with value',
    three: '',
    four: '',
    five: 'Disabled with value',
    six: '',
    seven: '',
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    const examples: Array<ExampleCode> = PASSWORD_EXAMPLES;
    for (const idx in examples) {
      if (examples[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
        this.examplesCode[idx] = examples[idx].code;
      }
    }
  }
}
