import { Component, OnInit } from '@angular/core';
import { AbstractControlDemoComponent } from '../abstract-control-demo.component';
import { FuiFormLayoutEnum } from '@ferui/components';
import { DemoComponentData } from '../../../utils/demo-component-data';

@Component({
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [title]="'Examples'" [active]="true">
          <demo-page [filtersDisplayed]="true" pageTitle="Input component">
            <demo-component [form]="demoForm" [componentData]="inputOne"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputTwo"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputThree"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFour"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputFive"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSix"></demo-component>
            <demo-component [form]="demoForm" [componentData]="inputSeven"></demo-component>
            <div class="footer">
              <button
                class="btn btn-primary"
                [disabled]="!demoForm.form.valid"
                (click)="promptSubmitInfos()"
                type="submit"
              >
                Submit
              </button>
              <button class="btn btn-success" type="button" (click)="validate()">Validate</button>
              <button class="btn btn-light" type="button" (click)="demoForm.reset()">Reset</button>
            </div>
          </demo-page>
        </fui-tab>
        <fui-tab [title]="'Documentation'">
          <div class="row">
            <div class="col-auto">
              <h5>Basic knowledge</h5>
              <br />
              <p>
                Our selects are a little bit different than our other components. We decided to rely on a powerful,
                fully-featured 3rd Party <code>ng-select</code> component at version 2.20.5. For more information about
                <code>ng-select</code>
                we invite you to follow
                <a href="https://github.com/ng-select/ng-select/tree/v2.20.5" target="_blank">their documentation</a>.
              </p>
              <p>
                Note : We've forked their project and changed the name of the main component to follow our naming
                convention. You'll need to replace <code>&lt;ng-select&gt;...&lt;/ng-select&gt;</code> by
                <code>&lt;fui-select&gt;...&lt;/fui-select&gt;</code>. But everything else is the exact same thing. You
                don't need to add extra lib, everything is tied to <code>ferui-components</code>.
              </p>
            </div>
          </div>
        </fui-tab>
      </fui-tabs>
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

  fuiFormLayoutEnum = FuiFormLayoutEnum;

  inputOne: DemoComponentData;
  inputTwo: DemoComponentData;
  inputThree: DemoComponentData;
  inputFour: DemoComponentData;
  inputFive: DemoComponentData;
  inputSix: DemoComponentData;
  inputSeven: DemoComponentData;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.inputOne = new DemoComponentData({
      title: `<h5>Basic example (without error handling)</h5>`,
      models: { selectedCity: this.model.selectedCity },
      params: { defaultBindingsList: this.defaultBindingsList },
      canDisable: false,
      source: `<fui-select #code fuiSelect name="city" [items]="params.defaultBindingsList" [(ngModel)]="models.selectedCity"></fui-select>`,
    });

    this.inputTwo = new DemoComponentData({
      title: `<h5>Basic example (including error handling)</h5>`,
      models: { selectedCountryId: this.model.selectedCountryId },
      params: { countries: this.countries },
      canDisable: false,
      source: `
          <fui-select-container #code>
            <label>Select value</label>
            <fui-select
              fuiSelect
              name="country"
              [items]="params.countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              [(ngModel)]="models.selectedCountryId"
              required>
            </fui-select>
          </fui-select-container>`,
    });

    this.inputThree = new DemoComponentData({
      title: `<h5>Multiple select</h5>`,
      models: { selectedCountries: this.model.selectedCountries },
      params: { countries: this.countries },
      canDisable: false,
      source: `
          <fui-select-container #code>
            <label>Countries</label>
            <fui-select
              fuiSelect
              name="countries"
              [items]="params.countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              placeholder="Select countries"
              [multiple]="true"
              [(ngModel)]="models.selectedCountries"
              required>
            </fui-select>
          </fui-select-container>`,
    });

    this.inputFour = new DemoComponentData({
      title: `<h5>Icon example</h5>`,
      models: { selectedMultipleCountry: this.model.selectedMultipleCountry },
      params: { countries: this.countries },
      canDisable: false,
      source: `
          <fui-select-container #code>
            <clr-icon shape="fui-columns" fuiSelectIcon></clr-icon>
            <fui-select
              fuiSelect
              name="countriesIcon"
              [items]="params.countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              [multiple]="true"
              [closeOnSelect]="false"
              [(ngModel)]="models.selectedMultipleCountry">
            </fui-select>
          </fui-select-container>`,
    });

    this.inputFive = new DemoComponentData({
      title: `<h5>Small layout (single-select)</h5>`,
      models: { smallLayoutCountry: this.model.smallLayoutCountry },
      params: {
        countries: this.countries,
        fuiFormLayoutEnum: this.fuiFormLayoutEnum,
      },
      canDisable: false,
      source: `
          <fui-select-container #code>
            <label>Countries</label>
            <fui-select
              fuiSelect
              name="countriesSmall"
              [items]="params.countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              placeholder="Select countries"
              [layout]="params.fuiFormLayoutEnum.SMALL"
              [(ngModel)]="models.smallLayoutCountry">
            </fui-select>
          </fui-select-container>`,
    });

    this.inputSix = new DemoComponentData({
      title: `<h5>Small layout (multi-select)</h5>`,
      models: { smallLayoutCountries: this.model.smallLayoutCountries },
      params: {
        countries: this.countries,
        fuiFormLayoutEnum: this.fuiFormLayoutEnum,
      },
      canDisable: false,
      source: `
          <fui-select-container #code>
            <label>Countries</label>
            <fui-select fuiSelect
              name="countriesSmallMultiple"
              [items]="params.countries"
              bindLabel="nested.name"
              bindValue="nested.countryId"
              placeholder="Select countries"
              [layout]="params.fuiFormLayoutEnum.SMALL"
              [multiple]="true"
              [(ngModel)]="models.smallLayoutCountries">
            </fui-select>
          </fui-select-container>`,
    });

    this.inputSeven = new DemoComponentData({
      title: `<h5>Native select support (doesn't use ng-select library)</h5>`,
      models: { selectedCityNative: this.model.selectedCityNative },
      params: { defaultBindingsList: this.defaultBindingsList },
      canDisable: false,
      source: `
          <p>
            If for any reason you want to use a native selector, you can ! But be aware that you will miss all the
            awesomeness of ng-select though ;-)
          </p>
          <fui-select-container #code>
            <label>City</label>
            <select placeholder="Please select a city"
              fuiSelect
              required
              name="cityNative"
              [(ngModel)]="models.selectedCityNative">
              <option *ngFor="let city of params.defaultBindingsList" [disabled]="city.disabled" [ngValue]="city">{{city.label}}</option>
            </select>
          </fui-select-container>`,
    });
  }
}
