import { Component, OnInit } from '@angular/core';
import { DemoComponentData } from '../../utils/demo-component-data';

@Component({
  selector: 'tabs-demo-example',
  template: `
    <h1 class="mt-4">FerUI Tabs Component</h1>
    <hr />
    <fui-tabs>
      <fui-tab [title]="'Documentation'">
        <h2 class="mt-4">Overview</h2>
        <p>
          The tabs component is fairly simple, it just allow you to create tabs that transclude your content.
          <br />
          You just need to create your <code>&lt;fui-tab&gt;</code> element that contains your content (using
          <code>[templateOutletRef]</code> attribute or just by transcluding your content within this element) and wrap them
          within a <code>&lt;fui-tabs&gt;&lt;/fui-tabs&gt;</code> element.
          <br />
          <demo-component [componentData]="examples[0]"></demo-component>
          <br />
          We are using angular <code>*ngIf</code> internally to display/hide the tab content, and you can customise the tab title
          by using the <code>[titleTemplateOutletRef]</code> attribute or just by setting a simple string title by using the
          <code>[title]</code> attribute.
          <br />
          By default, if you don't specify any [title] nor [titleTemplateOutletRef], the component will uses "Tab n" (where n
          correspond to the tab index).
          <br /><br />
          NOTE: At the moment, we only have one style of tabs but we have plans to add more features like vertical tabs or tabs
          offset.
        </p>

        <h2 class="mt-4"><code>&lt;fui-tab&gt;</code> public API</h2>

        <table class="fui-table">
          <thead>
            <tr>
              <th width="200">Property</th>
              <th width="295">Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>[title]</code></td>
              <td>string</td>
              <td>This is the title for the current tab.</td>
            </tr>
            <tr>
              <td><code>[active]</code></td>
              <td>boolean</td>
              <td>
                You can activate the tab by setting this attribute to true. By default it will activate the first tab. Note that
                if you activate multiple tabs, only the last one will be selected.
              </td>
            </tr>
            <tr>
              <td><code>[templateOutletRef]</code></td>
              <td>TemplateRef&lt;any&gt;</td>
              <td>You can specify the template for the tab programmatically instead of using content transclude.</td>
            </tr>
            <tr>
              <td><code>[templateOutletContext]</code></td>
              <td>Object</td>
              <td>The context object to use along with <code>[templateOutletRef]</code> to generate the template.</td>
            </tr>
            <tr>
              <td><code>[titleTemplateOutletRef]</code></td>
              <td>TemplateRef&lt;any&gt;</td>
              <td>
                You can specify the template for the tab title programmatically instead of using the <code>[title]</code> simple
                string. This is useful if you've planed to use custom title containing icons or custom styles etc...
              </td>
            </tr>
            <tr>
              <td><code>[titleTemplateOutletContext]</code></td>
              <td>Object</td>
              <td>The context object to use along with <code>[titleTemplateOutletRef]</code> to generate the template.</td>
            </tr>
          </tbody>
        </table>
      </fui-tab>
      <fui-tab [title]="'Examples'">
        <demo-page pageTitle="Tabs component">
          <demo-component *ngFor="let example of examples" [componentData]="example"></demo-component>
        </demo-page>
      </fui-tab>
    </fui-tabs>
  `
})
export class TabsDemo implements OnInit {
  examples: Array<DemoComponentData> = [];

  ngOnInit(): void {
    this.examples.push(
      new DemoComponentData({
        title: 'Simple tabs implementation',
        source: `
        <fui-tabs>
          <fui-tab [title]="'Tab 1'">Tab 1 content</fui-tab>
          <fui-tab [title]="'Tab 2'" [active]="true">Tab 2 content</fui-tab>
        </fui-tabs>
      `
      }),

      new DemoComponentData({
        title: 'Tabs without using active attribute',
        source: `
        <fui-tabs>
          <fui-tab [title]="'Tab 1'">Tab 1 content</fui-tab>
          <fui-tab [title]="'Tab 2'">Tab 2 content</fui-tab>
        </fui-tabs>
      `
      }),

      new DemoComponentData({
        title: 'Tabs using templates for both title and content',
        params: {
          tabExamples: [
            { title: 'Message', icon: 'message', content: 'Tab message content' },
            { title: 'Screenshot', icon: 'screenshot', content: 'Tab screenshot content' }
          ]
        },
        source: `
        <ng-template #titleTplt let-title="title" let-icon="icon">
            <clr-icon *ngIf="icon === 'message'" shape="fui-message" style="width: 10px; height: 10px"></clr-icon>
            <clr-icon *ngIf="icon === 'screenshot'" shape="fui-screenshot" style="width: 10px; height: 10px"></clr-icon>
            {{title}}
        </ng-template>
        <ng-template #contentTplt let-item>
            This is the content for item :
            <pre><code>{{item | json}}</code></pre>
        </ng-template>
        <fui-tabs>
          <fui-tab *ngFor="let tab of params.tabExamples"
          [titleTemplateOutletRef]="titleTplt" [titleTemplateOutletContext]="tab"
          [templateOutletRef]="contentTplt" [templateOutletContext]="{$implicit: tab}"></fui-tab>
        </fui-tabs>
      `
      })
    );
  }
}
