import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { ExampleCode } from '../abstract-control-demo.component';
import { TEXTAREA_TEMPLATE, TEXTAREA_EXAMPLES } from './textarea.template';

@Component({
  template: TEXTAREA_TEMPLATE,
})
export class TextareaComponent extends AbstractControlDemoComponent implements OnInit {
  model = {
    one: '',
    two: 'Filled with value',
    three: '',
    four:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet feugiat tristique. Nulla facilisi. Mauris id mauris hendrerit, rutrum arcu sit amet, porttitor nunc. Pellentesque volutpat porttitor ultrices. Nullam lorem felis, aliquet sit amet dui luctus, rutrum sollicitudin nisl. Etiam ligula felis, pellentesque a vulputate ut, fringilla nec tellus. Vivamus vitae dapibus massa, sed viverra arcu. Aenean semper mi a est molestie mattis. Phasellus fringilla nunc et metus aliquet, ac egestas eros pretium. Cras sed dapibus eros. Proin ultrices pellentesque ligula, et ornare sem auctor sed. Aliquam erat volutpat. Pellentesque volutpat scelerisque nunc, in mollis nunc ullamcorper et.',
    five: 'Disabled with value',
    six: '',
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    const examples: Array<ExampleCode> = TEXTAREA_EXAMPLES;
    for (const idx in examples) {
      if (examples[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
        this.examplesCode[idx] = examples[idx].code;
      }
    }
  }
}
