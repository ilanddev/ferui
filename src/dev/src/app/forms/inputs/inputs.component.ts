import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { ExampleCode } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { INPUT_EXAMPLES, INPUT_TEMPLATE } from './inputs.template';

@Component({
  template: INPUT_TEMPLATE,
})
export class InputsComponent extends AbstractControlDemoComponent implements OnInit {
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
    const examples: Array<ExampleCode> = INPUT_EXAMPLES;
    for (const key in examples) {
      if (examples[key]) {
        this.examples[key] = this.defaultExampleValue;
        this.results[key] = this.defaultResultValue;
        this.examplesCode[key] = examples[key].code;
      }
    }
  }
}
