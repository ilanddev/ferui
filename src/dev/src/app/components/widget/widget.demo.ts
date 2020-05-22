import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DemoComponentData } from '../../utils/demo-component-data';
import { FuiDatetimeModelTypes } from '@ferui/components';

@Component({
  selector: 'widget-demo-example',
  template: `
    <h1 class="mt-4">FerUI Widget Component</h1>
    <hr />
    <form fuiForm class="container-fluid" #demoForm="ngForm">
      <fui-tabs>
        <fui-tab [active]="selectedTab === 'doc'" [title]="'Documentation'">
          <h2 class="mt-3">Overview</h2>
          <p>In FerUI, a widget is a component composed of 3 parts</p>
          <ul>
            <li>The Header (where you can place the title and possible actions)</li>
            <li>The Body (where you place your content)</li>
            <li>The Footer</li>
          </ul>
          <br />
          <h2>How to use it ?</h2>

          <p>
            This is pretty simple, you just need to transclude your content into each specific sub-components
            (<code>&lt;fui-widget-header&gt;</code>, <code>&lt;fui-widget-header&gt;</code>,
            <code>&lt;fui-widget-title&gt;</code>, <code>&lt;fui-widget-subtitle&gt;</code>,
            <code>&lt;fui-widget-actions&gt;</code>, <code>&lt;fui-widget-body&gt;</code>, <code>&lt;fui-widget-footer&gt;</code>)
            in order to generate a well formatted widget. (see the
            <a class="text-primary" (click)="selectedTab = 'examples'">Example section</a> for more info).
          </p>
          <h2 class="mt-4">Public API</h2>

          <table class="fui-table">
            <thead>
              <tr>
                <th width="200">Tag</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>&lt;fui-widget&gt;</code></td>
                <td>
                  <b>(Mandatory)</b> This is the global wrapper for the widget component. Every other tags must be declared
                  withing this one.
                </td>
              </tr>
              <tr>
                <td><code>&lt;fui-widget-header&gt;</code></td>
                <td>
                  <b>(optional)</b> This is the header container. It allows you to add content in the header section of a widget.
                  This must be placed within an <code>&lt;fui-widget&gt;</code> tag.<br />
                  Note: If you want, you can add the <code>border-bottom-0</code> class to this element to remove the border
                  bottom for this element.
                </td>
              </tr>
              <tr>
                <td><code>&lt;fui-widget-title&gt;</code></td>
                <td>
                  <b>(optional)</b> This tag must be declared within a <code>&lt;fui-widget-header&gt;</code> tag. It allows you
                  to set a title for your widget.
                </td>
              </tr>
              <tr>
                <td><code>&lt;fui-widget-subtitle&gt;</code></td>
                <td>
                  <b>(Optional)</b> This tag must be declared within a <code>&lt;fui-widget-header&gt;</code> tag. It allows you
                  to set a sub-title for your widget.
                </td>
              </tr>
              <tr>
                <td><code>&lt;fui-widget-actions&gt;</code></td>
                <td>
                  <b>(Optional)</b> This tag must be declared within a <code>&lt;fui-widget-header&gt;</code> tag. It allows you
                  to set an action section for your widget header.
                </td>
              </tr>
              <tr>
                <td><code>&lt;fui-widget-body&gt;</code></td>
                <td>
                  <b>(Optional)</b> This tag must be declared within a <code>&lt;fui-widget&gt;</code> tag. It allows you to set
                  the content for your widget.
                </td>
              </tr>
              <tr>
                <td><code>&lt;fui-widget-footer&gt;</code></td>
                <td>
                  <b>(Optional)</b> This tag must be declared within a <code>&lt;fui-widget&gt;</code> tag. It allows you to set a
                  footer for your widget.
                </td>
              </tr>
            </tbody>
          </table>
        </fui-tab>
        <fui-tab [active]="selectedTab === 'examples'" [title]="'Examples'">
          <demo-page pageTitle="Widget component">
            <demo-component *ngFor="let example of examples" [form]="demoForm" [componentData]="example"></demo-component>
          </demo-page>
        </fui-tab>
      </fui-tabs>
    </form>
  `
})
export class WidgetDemo implements OnInit {
  @ViewChild('demoForm') form: NgForm;
  selectedTab: string = 'doc';
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
      `
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
      `
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
      `
      })
    );

    this.examples.push(
      new DemoComponentData({
        title: 'Widget - Full example',
        models: { one: '', checkboxOne: false, checkboxTwo: true, date: new Date() },
        params: { dateType: FuiDatetimeModelTypes.DATE },
        source: `
        <fui-widget>
          <fui-widget-header class="border-bottom-0">
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
      `
      })
    );
  }

  goToExamplesPage() {
    document.getElementById('exampleSection').click();
  }
}
