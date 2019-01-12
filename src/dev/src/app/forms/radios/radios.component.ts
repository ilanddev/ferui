import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { ExampleCode } from '../abstract-control-demo.component';
import { RADIOS_TEMPLATE, RADIOS_EXAMPLES } from './radios.template';

@Component({
  template: RADIOS_TEMPLATE,
})
export class RadiosComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: true,
    twobis: '',
    three: 'option2',
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    const examples: Array<ExampleCode> = RADIOS_EXAMPLES;
    for (const idx in examples) {
      if (examples[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
        this.examplesCode[idx] = examples[idx].code;
      }
    }
  }
}
