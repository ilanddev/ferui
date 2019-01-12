import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { ExampleCode } from '../abstract-control-demo.component';
import { CHECKBOX_EXAMPLES, CHECKBOX_TEMPLATE } from './checkbox.template';

@Component({
  template: CHECKBOX_TEMPLATE,
})
export class CheckboxComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    twobis: '',
    three: false,
    threebis: null,
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    const examples: Array<ExampleCode> = CHECKBOX_EXAMPLES;
    for (const idx in examples) {
      if (examples[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
        this.examplesCode[idx] = examples[idx].code;
      }
    }
  }
}
