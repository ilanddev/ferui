import { Component } from '@angular/core';
import { DemoComponentData } from '../../utils/demo-component-data';
import { FuiDatetimeModelTypes } from '@ferui/components';

@Component({
  template: `
    <demo-page pageTitle="Widget Component" [examples]="examples"></demo-page>
  `,
})
export class WidgetComponent {
  examples: Array<DemoComponentData> = [];

  constructor() {
    this.examples.push(
      new DemoComponentData({
        title: 'Widget with header title and subtitle',
        models: { three: 'test' },
        source: `
        <fui-widget>
          <fui-widget-header>
            <fui-widget-title>Summary widget</fui-widget-title>
            <fui-widget-subtitle>Ubuntu Linux (64 bits)</fui-widget-subtitle>
          </fui-widget-header>
          <fui-widget-body>
            <fui-input-container>
              <label>Enter your name</label>
              <input placeholder="With placeholder" fuiInput name="three" [(ngModel)]="models.three" required/>
              <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
            </fui-input-container>
          </fui-widget-body>
        </fui-widget>
      `,
      })
    );

    this.examples.push(
      new DemoComponentData({
        title: 'Widget with header and actions',
        models: { date: new Date() },
        params: { dateType: FuiDatetimeModelTypes.DATE },
        source: `
        <fui-widget>
          <fui-widget-header>
            <fui-widget-title>Summary widget</fui-widget-title>
            <fui-widget-subtitle>Ubuntu Linux (64 bits)</fui-widget-subtitle>
            <fui-widget-actions>
              <fui-date-container>
                <label>Start Date</label>
                <input name="oneDate" type="date" placeholder="Choose a date from datepicker" [fuiDate]="params.dateType" [(ngModel)]="models.date"/>
              </fui-date-container>
            </fui-widget-actions>
          </fui-widget-header>
          <fui-widget-body>
            My Widget Body
          </fui-widget-body>
        </fui-widget>
      `,
      })
    );

    this.examples.push(
      new DemoComponentData({
        title: 'Widget with footer',
        source: `
        <fui-widget>
          <fui-widget-header>
            <fui-widget-title>Summary widget</fui-widget-title>
            <fui-widget-subtitle>Ubuntu Linux (64 bits)</fui-widget-subtitle>
          </fui-widget-header>
          <fui-widget-body>
            My Widget Body
          </fui-widget-body>
          <fui-widget-footer>Sample footer</fui-widget-footer>
        </fui-widget>
      `,
      })
    );

    this.examples.push(
      new DemoComponentData({
        title: 'Widget - Full example',
        models: { one: '', checkboxOne: false, checkboxTwo: true, date: new Date() },
        params: { dateType: FuiDatetimeModelTypes.DATE },
        source: `
        <fui-widget>
          <fui-widget-header>
            <fui-widget-title>Dev and Staging VM</fui-widget-title>
            <fui-widget-subtitle>Ubuntu Linux (64 bits)</fui-widget-subtitle>
            <fui-widget-actions>
              <fui-date-container class="m-0">
                <label>Start Date</label>
                <input name="userDate" type="date" placeholder="Choose a date from datepicker" [fuiDate]="params.dateType" [(ngModel)]="models.date"/>
              </fui-date-container>
            </fui-widget-actions>
          </fui-widget-header>
          <fui-widget-body>
            <fui-date-container>
              <input type="date" name="timeDD" fuiDate [(ngModel)]="models.date" />
            </fui-date-container>
            <p class="text-justify mb-3">Integer sit amet enim non augue mattis fermentum ac vel justo. Integer eu ultricies dolor. Nam viverra ligula a orci ultrices molestie. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lobortis magna id elit egestas fermentum. Praesent et est porttitor neque gravida dignissim nec a turpis. Sed gravida dignissim gravida. Proin vitae odio imperdiet nibh porttitor luctus.</p>
            <fui-input-container>
              <label>Enter your name</label>
              <input placeholder="With placeholder" fuiInput name="username" [(ngModel)]="models.one" required/>
              <fui-control-error>This field is required (this message overwrite any other ones)</fui-control-error>
            </fui-input-container>
            <h5 class="mt-4">Select an option:</h5>
            <fui-checkbox-wrapper class="mt-3">
              <input type="checkbox" fuiCheckbox name="checkboxOne" [(ngModel)]="models.checkboxOne"/>
              <label>Option 1</label>
            </fui-checkbox-wrapper>
            <fui-checkbox-wrapper>
              <input type="checkbox" fuiCheckbox name="checkboxTwo" [(ngModel)]="models.checkboxTwo"/>
              <label>Option 2</label>
            </fui-checkbox-wrapper>
            <p class="text-justify mt-3 mb-0">Integer sit amet enim non augue mattis fermentum ac vel justo. Integer eu ultricies dolor. Nam viverra ligula a orci ultrices molestie. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lobortis magna id elit egestas fermentum. Praesent et est porttitor neque gravida dignissim nec a turpis. Sed gravida dignissim gravida. Proin vitae odio imperdiet nibh porttitor luctus.</p>
          </fui-widget-body>
          <fui-widget-footer class=""><input type="button" class="btn-success float-right rounded" value="Validate"></fui-widget-footer>
        </fui-widget>
      `,
      })
    );
  }
}
