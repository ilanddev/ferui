import { Component } from '@angular/core';
import { CheckboxComponentTemplate } from './checkbox.template';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { ExampleCode } from '../abstract-control-demo.component';

const componentTemplate: CheckboxComponentTemplate = CheckboxComponentTemplate.getInstance();

@Component({
  template: componentTemplate.template || ``,
})
export class CheckboxComponent extends AbstractControlDemoComponent implements OnInit {
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
    three: false,
    threebis: null,
  };
}
