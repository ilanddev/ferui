import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { ExampleCode } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { PasswordsComponentTemplate } from './password.template';

const componentTemplate: PasswordsComponentTemplate = PasswordsComponentTemplate.getInstance();

@Component({
  template: componentTemplate.template || ``,
})
export class PasswordComponent extends AbstractControlDemoComponent implements OnInit {
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
    two: 'Filled with value',
    three: '',
    four: '',
    five: 'Disabled with value',
    six: '',
    seven: '',
  };
}
