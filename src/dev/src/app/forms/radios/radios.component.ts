import { Component } from '@angular/core';
import { RadioComponentTemplate } from './radios.template';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { ExampleCode } from '../abstract-control-demo.component';

const componentTemplate: RadioComponentTemplate = RadioComponentTemplate.getInstance();

@Component({
  template: componentTemplate.template || ``,
})
export class RadiosComponent extends AbstractControlDemoComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit(): void {
    const examples: Array<ExampleCode> = componentTemplate.getExamples();
    for (const idx in examples) {
      if (examples[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
        this.examplesCode[idx] = examples[idx].code;
      }
    }
  }

  model = {
    one: '',
    two: true,
    twobis: '',
    three: 'option2',
  };
}
