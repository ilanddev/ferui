import { AbstractControlTemplate } from '../abstract-control-demo.component';

/**
 * This template class is used only to make our day easier.
 * To avoid writing the code within a template and copy/pate it to another variable for highlight directive.
 * The typescript class allow us to write the elements only once within variables that
 * both template and highlight directive can be fed with.
 */
export class SelectsComponentTemplate extends AbstractControlTemplate {
  private static instance: SelectsComponentTemplate;

  static getInstance() {
    if (!SelectsComponentTemplate.instance) {
      SelectsComponentTemplate.instance = new SelectsComponentTemplate();
    }
    return SelectsComponentTemplate.instance;
  }

  private constructor() {
    // We set the global page title.
    super('Selects Page');
    this.examplesCode = [
      {
        title: 'Basic knowledge',
        description: `Our selects are a little bit different than our other components. We decided to rely on a powerful, fully-featured 3rd Party <code>ng-select</code> component. For more information about <code>ng-select</code> we invite you to follow <a href="https://ng-select.github.io/ng-select#/" target="_blank">their documentation</a>.<br /> We've just added our custom error message handler and design.`,
        code: ``,
        resultModels: [],
      },
      {
        title: 'Basic example (without error handling)',
        code: `<ng-select fuiSelect name="city" [items]="defaultBindingsList"
  [(ngModel)]="model.selectedCity">
</ng-select>`,
        resultModels: ['selectedCity'],
      },
      {
        title: 'Basic example (including error handling)',
        code: `<fui-select-container>
  <label>Country</label>
  <ng-select fuiSelect name="country" [items]="countries"
     bindLabel="nested.name"
     bindValue="nested.countryId"
     placeholder="Select value"
     [(ngModel)]="model.selectedCountryId"
     required>
  </ng-select>
</fui-select-container>`,
        resultModels: ['selectedCountryId'],
      },
      {
        title: 'Using native select',
        description: `If for any reason you want to use a native selector, you can ! But be aware that you will miss all the awesomeness of ng-select though ;-)`,
        code: ``,
        resultModels: [],
      },
      {
        title: "Native select support (doesn't use ng-select library)",
        code: `<fui-select-container>
  <label>City</label>
  <select placeholder="Please select a city" fuiSelect required name="cityNative" [(ngModel)]="model.selectedCityNative">
    <option *ngFor="let city of cities" [disabled]="city.disabled" [ngValue]="city">{{city.name}}</option>
  </select>
</fui-select-container>`,
        resultModels: ['selectedCityNative'],
      },
    ];
    super.init();
  }
}
