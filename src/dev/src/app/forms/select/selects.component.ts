import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { ExampleCode } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { SELECTS_TEMPLATE, SELECTS_EXAMPLES } from './selects.template';

@Component({
  template: SELECTS_TEMPLATE,
})
export class SelectsComponent extends AbstractControlDemoComponent implements OnInit {
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys', disabled: true },
  ];

  cities = [{ id: 1, name: 'Vilnius' }, { id: 2, name: 'Kaunas' }, { id: 3, name: 'Pavilnys', disabled: true }];

  countries = [
    { id: 1, nested: { countryId: 'L', name: 'Lithuania' } },
    { id: 2, nested: { countryId: 'U', name: 'USA' } },
    { id: 3, nested: { countryId: 'A', name: 'Australia' } },
  ];

  model = {
    selectedCountryId: null,
    selectedCity: null,
    selectedCityNative: null,
    selectedCityId: null,
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
    const examples: Array<ExampleCode> = SELECTS_EXAMPLES;
    for (const idx in examples) {
      if (examples[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
        this.examplesCode[idx] = examples[idx].code;
      }
    }
  }
}
