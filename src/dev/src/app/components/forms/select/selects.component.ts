import { Component } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { OnInit } from '@angular/core';
import { FuiFormLayoutEnum } from '../../../../../../ferui-components/forms/common/layout.enum';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <default-template-wrapper
        [pageTitle]="'Password Page'"
        [(disabled)]="disabled"
        [examples]="examples"
        [results]="results"
        (toggleEvent)="toggle($event)"
      >
        <default-template-content>
          <h5 #title>Basic knowledge</h5>
          <p #description>
            Our selects are a little bit different than our other components. We decided to rely on a powerful,
            fully-featured 3rd Party <code>ng-select</code> component. For more information about <code>ng-select</code> we
            invite you to follow <a href="https://ng-select.github.io/ng-select#/" target="_blank">their documentation</a>.
          </p>
          <p #description>
            Note : We've just added our custom error message handler and updated the design.
          </p>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[0]"
          [examples]="examples"
          [results]="results"
          [idx]="0"
          [resultModelNames]="'selectedCity'"
        >
          <h5 #title>Basic example (without error handling)</h5>
          <fui-select fuiSelect name="city" [items]="defaultBindingsList" [(ngModel)]="model.selectedCity"></fui-select>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[1]"
          [examples]="examples"
          [results]="results"
          [idx]="1"
          [resultModelNames]="'selectedCountryId'"
        >
          <h5 #title>Basic example (including error handling)</h5>
          <fui-select-container>
            <label>Select value</label>
            <fui-select
              fuiSelect
              name="country"
              [items]="countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              [(ngModel)]="model.selectedCountryId"
              required
            >
            </fui-select>
          </fui-select-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[4]"
          [examples]="examples"
          [results]="results"
          [idx]="4"
          [resultModelNames]="'selectedCountries'"
        >
          <h5 #title>Multiple select</h5>
          <fui-select-container>
            <label>Countries</label>
            <fui-select
              fuiSelect
              name="countries"
              [items]="countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              placeholder="Select countries"
              [multiple]="true"
              [(ngModel)]="model.selectedCountries"
              required
            >
            </fui-select>
          </fui-select-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[3]"
          [examples]="examples"
          [results]="results"
          [idx]="3"
          [resultModelNames]="'selectedMultipleCountry'"
        >
          <h5 #title>Icon example</h5>
          <fui-select-container>
            <clr-icon shape="fui-columns" fuiSelectIcon></clr-icon>
            <fui-select
              fuiSelect
              name="countriesIcon"
              [items]="countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              [multiple]="true"
              [closeOnSelect]="false"
              [(ngModel)]="model.selectedMultipleCountry"
            >
            </fui-select>
          </fui-select-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[6]"
          [examples]="examples"
          [results]="results"
          [idx]="6"
          [resultModelNames]="'smallLayoutCountry'"
        >
          <h5 #title>Small layout (single-select)</h5>
          <fui-select-container>
            <label>Countries</label>
            <fui-select
              fuiSelect
              name="countriesSmall"
              [items]="countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              placeholder="Select countries"
              [layout]="fuiFormLayoutEnum.SMALL"
              [(ngModel)]="model.smallLayoutCountry"
            >
            </fui-select>
          </fui-select-container>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[5]"
          [examples]="examples"
          [results]="results"
          [idx]="5"
          [resultModelNames]="'smallLayoutCountries'"
        >
          <h5 #title>Small layout (multi-select)</h5>
          <fui-select-container>
            <label>Countries</label>
            <fui-select
              fuiSelect
              name="countriesSmallMultiple"
              [items]="countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              placeholder="Select countries"
              [layout]="fuiFormLayoutEnum.SMALL"
              [multiple]="true"
              [(ngModel)]="model.smallLayoutCountries"
            >
            </fui-select>
          </fui-select-container>
        </default-template-content>

        <default-template-content>
          <h5 #title>Using native select</h5>
          <p #description>
            If for any reason you want to use a native selector, you can ! But be aware that you will miss all the
            awesomeness of ng-select though ;-)
          </p>
        </default-template-content>

        <default-template-content
          [disabled]="disabled"
          [model]="model"
          [code]="exampleCodes[2]"
          [examples]="examples"
          [results]="results"
          [idx]="2"
          [resultModelNames]="'selectedCityNative'"
        >
          <h5 #title>Native select support (doesn't use ng-select library)</h5>
          <fui-select-container>
            <label>City</label>
            <select
              placeholder="Please select a city"
              fuiSelect
              required
              name="cityNative"
              [(ngModel)]="model.selectedCityNative"
            >
              <option *ngFor="let city of defaultBindingsList" [disabled]="city.disabled" [ngValue]="city">{{
                city.label
              }}</option>
            </select>
          </fui-select-container>
        </default-template-content>
      </default-template-wrapper>
      <div class="footer">
        <button class="btn btn-primary" [disabled]="!demoForm.form.valid" type="submit">Submit</button>
        <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
        <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
      </div>
    </form>
  `,
})
export class SelectsComponent extends AbstractControlDemoComponent implements OnInit {
  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys', disabled: true },
  ];

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
    selectedMultipleCountry: null,
    selectedCountries: null,
    smallLayoutCountries: null,
    smallLayoutCountry: null,
  };

  exampleCodes: Array<string> = [
    `<fui-select fuiSelect name="city" [items]="defaultBindingsList"
  [(ngModel)]="model.selectedCity">
</fui-select>`,
    `<fui-select-container>
  <label>Select value</label>
  <fui-select fuiSelect name="country" [items]="countries"
             bindLabel="nested.name"
             bindValue="nested.countryId"
             [(ngModel)]="model.selectedCountryId"
             required>
  </fui-select>
</fui-select-container>`,
    `<fui-select-container>
  <label>City</label>
  <select placeholder="Please select a city" fuiSelect required name="cityNative" [(ngModel)]="model.selectedCityNative">
    <option *ngFor="let city of cities" [disabled]="city.disabled" [ngValue]="city">{{city.name}}</option>
  </select>
</fui-select-container>`,
    `<fui-select-container>
  <clr-icon shape="fui-columns" fuiSelectIcon></clr-icon>
  <fui-select fuiSelect name="countriesIcon" [items]="countries"
             bindLabel="nested.name"
             bindValue="nested.countryId"
             [multiple]="true"
             [closeOnSelect]="false"
             [(ngModel)]="model.selectedMultipleCountry">
  </fui-select>
</fui-select-container>`,
    `<fui-select-container>
  <label>Countries</label>
  <fui-select fuiSelect name="countries" [items]="countries"
             bindLabel="nested.name"
             bindValue="nested.countryId"
             placeholder="Select countries"
             [multiple]="true"
             [(ngModel)]="model.selectedCountries"
             required>
  </fui-select>
</fui-select-container>`,
    `<fui-select-container>
  <label>Countries</label>
  <fui-select fuiSelect name="countriesSmallMultiple" [items]="countries"
             bindLabel="nested.name"
             bindValue="nested.countryId"
             placeholder="Select countries"
             [layout]="fuiFormLayoutEnum.SMALL"
             [multiple]="true"
             [(ngModel)]="model.smallLayoutCountries">
  </fui-select>
</fui-select-container>`,
    `<fui-select-container>
  <label>Countries</label>
  <fui-select fuiSelect name="countriesSmall" [items]="countries"
             bindLabel="nested.name"
             bindValue="nested.countryId"
             placeholder="Select countries"
             [layout]="fuiFormLayoutEnum.SMALL"
             [(ngModel)]="model.smallLayoutCountry">
  </fui-select>
</fui-select-container>`,
  ];

  fuiFormLayoutEnum = FuiFormLayoutEnum;

  constructor() {
    super();
  }

  ngOnInit(): void {
    for (const idx in this.exampleCodes) {
      if (this.exampleCodes[idx]) {
        this.examples[idx] = this.defaultExampleValue;
        this.results[idx] = this.defaultResultValue;
      }
    }
  }
}
