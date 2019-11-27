import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DemoComponentData } from '../../utils/demo-component-data';
import { FuiDatetimeModelTypes } from '@ferui/components';

@Component({
  selector: 'widget-demo-example',
  template: `
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <demo-page pageTitle="Test widget component">
        <demo-component *ngFor="let example of examples" [form]="demoForm" [componentData]="example"></demo-component>
      </demo-page>
    </form>
  `,
})
export class WidgetDemo implements OnInit {
  @ViewChild('demoForm') form: NgForm;
  examples: Array<DemoComponentData> = [];
  ngOnInit(): void {
    this.examples.push(
      new DemoComponentData({
        title: 'Widget with header title and subtitle',
        models: { three: 'test' },
        source: `
        <fui-widget>
          <fui-widget-header>
            <fui-widget-title>Summary widget</fui-widget-title>
          </fui-widget-header>
          <fui-widget-body class="p-3">
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
          <fui-widget-body class="p-3">
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
          <fui-widget-body class="p-3">
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
              <fui-dropdown>
                <button class="btn btn-outline-primary" fuiDropdownTrigger>
                    Dropdown
                    <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
                </button>
                <fui-dropdown-menu *fuiIfOpen>
                    <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
                    <div aria-label="Dropdown header Action 1" fuiDropdownItem>Action 1</div>
                    <div aria-label="Dropdown header Disabled Action" [class.disabled]="true" fuiDropdownItem>Disabled Action</div>
                    <div class="fui-dropdown-divider" role="separator" aria-hidden="true"></div>
                    <fui-dropdown>
                        <button fuiDropdownTrigger>Link 1</button>
                        <fui-dropdown-menu>
                            <button fuiDropdownItem>Foo</button>
                            <fui-dropdown>
                                <button fuiDropdownTrigger>Bar</button>
                                <fui-dropdown-menu fuiPosition="left-top">
                                    <button fuiDropdownItem>Baz</button>
                                </fui-dropdown-menu>
                            </fui-dropdown>
                        </fui-dropdown-menu>
                    </fui-dropdown>
                    <div fuiDropdownItem>Link 2</div>
                </fui-dropdown-menu>
              </fui-dropdown>
            </fui-widget-actions>
          </fui-widget-header>
          <fui-widget-body class="p-3">
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
