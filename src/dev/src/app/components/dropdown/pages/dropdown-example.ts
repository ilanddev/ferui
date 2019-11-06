import { Component, OnInit } from '@angular/core';
import { DemoComponentData } from '../../../utils/demo-component-data';

@Component({
  selector: 'dropdown-demo-example',
  template: `
    <fui-tabs>
      <fui-tab [title]="'Examples'" [active]="true">
        <demo-page [filtersDisplayed]="true" pageTitle="Dropdown examples">
          <h3>Behavior</h3>
          <ul>
            <li>Clicking on the toggle opens the dropdown</li>
            <li>
              By default, selecting a menu item or clicking outside the menu dismisses the menu. You can change this behavior
              to keep the menu open on item selection
            </li>
          </ul>

          <h3>Placement</h3>
          <p>
            By default, a dropdown opens from the bottom of the toggle, along the left side. You can change the placement by
            using one of the eight direction classes.
          </p>

          <h3>Nested Menu</h3>

          <p>
            Nested menus are an extension of dropdown menus. They save screen space by organizing a long list of items into
            categories that the user can click to reveal deeper levels.
          </p>

          <h3>Examples:</h3>

          <h5>Position top-left:</h5>

          <demo-component [componentData]="dropdown1"></demo-component>

          <h5>Position bottom-right (default)</h5>

          <demo-component [componentData]="dropdown2"></demo-component>

          <h5 class="mt-3">Append to position</h5>

          <p class="mt-3">
            If you place fui-dropdown inside a <code>position: relative;</code> container with fixed height/width and hidden
            overflow the dropdown will still be visible.
          </p>

          <demo-component [componentData]="dropdown3"></demo-component>

          <p class="mt-3">
            But If you place fui-dropdown inside a <code>position: absolute|fixed;</code> container with fixed height/width
            and hidden overflow the dropdown will not be visible.
          </p>

          <demo-component [componentData]="dropdown4"></demo-component>

          <p class="mt-3">
            The solution is to use the <code>[appendTo]="ELEMENT_TAG_OR_ID_OR_CLASS_STRING"</code> property over the first
            <code>fui-dropdown-menu</code> element and append the menu to whatever parent container that works for your
            case.<br />
            Note that we are using <code>document.querySelector(appendTo);</code> selector internally.
          </p>
          <p>In our example below, we've assigned the menu to the body to make it work.</p>

          <demo-component [componentData]="dropdown5"></demo-component>

          <p class="mt-3">
            This last dropdown will automatically open its menu at the top because there is not enough space bellow it to add
            the menu. (Hide the code section to see this working)
          </p>

          <demo-component [componentData]="dropdown6"></demo-component>
        </demo-page>
      </fui-tab>
      <fui-tab [title]="'Documentation'">...</fui-tab>
    </fui-tabs>
  `,
})
export class DropdownExample implements OnInit {
  dropdown1: DemoComponentData;
  dropdown2: DemoComponentData;
  dropdown3: DemoComponentData;
  dropdown4: DemoComponentData;
  dropdown5: DemoComponentData;
  dropdown6: DemoComponentData;

  ngOnInit(): void {
    this.dropdown1 = new DemoComponentData({
      title: ``,
      source: `<fui-dropdown>
            <button class="btn btn-outline-primary" fuiDropdownTrigger>
              Dropdown
              <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
            </button>
            <fui-dropdown-menu fuiPosition="top-left" *fuiIfOpen>
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
          </fui-dropdown>`,
    });

    this.dropdown2 = new DemoComponentData({
      title: ``,
      source: `<fui-dropdown>
            <span style="display: inline-block; color: #000000;" fuiDropdownTrigger>
              Dropdown
              <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
            </span>
            <fui-dropdown-menu fuiPosition="bottom-left" *fuiIfOpen>
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
          </fui-dropdown>`,
    });

    this.dropdown3 = new DemoComponentData({
      title: ``,
      source: `<div style="padding: 10px; width: 220px; height: 100px; border: 1px solid #87a1b5; overflow: hidden; border-radius: 3px;">
            <p>My super overflow-box</p>
            
            <fui-dropdown>
              <span style="display: inline-block; color: #000000;" fuiDropdownTrigger>
                Dropdown
                <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
              </span>
              <fui-dropdown-menu *fuiIfOpen>
                <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
                <div aria-label="Dropdown header Action 1" fuiDropdownItem>Action 1</div>
                <div aria-label="Dropdown header Disabled Action" [class.disabled]="true" fuiDropdownItem>
                  Disabled Action
                </div>
                <div class="fui-dropdown-divider" role="separator" aria-hidden="true"></div>
                <fui-dropdown>
                  <button fuiDropdownTrigger>Link 1</button>
                  <fui-dropdown-menu>
                    <button fuiDropdownItem>Foo</button>
                    <fui-dropdown>
                      <button fuiDropdownTrigger>Bar</button>
                      <fui-dropdown-menu>
                        <button fuiDropdownItem>Baz</button>
                      </fui-dropdown-menu>
                    </fui-dropdown>
                  </fui-dropdown-menu>
                </fui-dropdown>
                <div fuiDropdownItem>Link 2</div>
              </fui-dropdown-menu>
            </fui-dropdown>
          </div>`,
    });

    this.dropdown4 = new DemoComponentData({
      title: ``,
      source: `<div
              style="position: absolute; padding: 10px; width: 220px; height: 100px; border: 1px solid #87a1b5; overflow: hidden; border-radius: 3px;"
            >
              <p>My super overflow-box</p>
              <fui-dropdown>
                <span style="display: inline-block; color: #000000;" fuiDropdownTrigger>
                  Dropdown
                  <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
                </span>
                <fui-dropdown-menu *fuiIfOpen>
                  <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
                  <div aria-label="Dropdown header Action 1" fuiDropdownItem>Action 1</div>
                  <div aria-label="Dropdown header Disabled Action" [class.disabled]="true" fuiDropdownItem>
                    Disabled Action
                  </div>
                  <div class="fui-dropdown-divider" role="separator" aria-hidden="true"></div>
                  <fui-dropdown>
                    <button fuiDropdownTrigger>Link 1</button>
                    <fui-dropdown-menu>
                      <button fuiDropdownItem>Foo</button>
                      <fui-dropdown>
                        <button fuiDropdownTrigger>Bar</button>
                        <fui-dropdown-menu>
                          <button fuiDropdownItem>Baz</button>
                        </fui-dropdown-menu>
                      </fui-dropdown>
                    </fui-dropdown-menu>
                  </fui-dropdown>
                  <div fuiDropdownItem>Link 2</div>
                </fui-dropdown-menu>
              </fui-dropdown>
            </div>`,
    });
    this.dropdown5 = new DemoComponentData({
      title: ``,
      source: `<div
              style="position: absolute; padding: 10px; width: 220px; height: 100px; border: 1px solid #87a1b5; overflow: hidden; border-radius: 3px;"
            >
              <p>My super overflow-box</p>
              <fui-dropdown>
                <span style="display: inline-block; color: #000000;" fuiDropdownTrigger>
                  Dropdown
                  <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
                </span>
                <fui-dropdown-menu [appendTo]="'body'" *fuiIfOpen>
                  <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
                  <div aria-label="Dropdown header Action 1" fuiDropdownItem>Action 1</div>
                  <div aria-label="Dropdown header Disabled Action" [class.disabled]="true" fuiDropdownItem>
                    Disabled Action
                  </div>
                  <div class="fui-dropdown-divider" role="separator" aria-hidden="true"></div>
                  <fui-dropdown>
                    <button fuiDropdownTrigger>Link 1</button>
                    <fui-dropdown-menu>
                      <button fuiDropdownItem>Foo</button>
                      <fui-dropdown>
                        <button fuiDropdownTrigger>Bar</button>
                        <fui-dropdown-menu>
                          <button fuiDropdownItem>Baz</button>
                        </fui-dropdown-menu>
                      </fui-dropdown>
                    </fui-dropdown-menu>
                  </fui-dropdown>
                  <div fuiDropdownItem>Link 2</div>
                </fui-dropdown-menu>
              </fui-dropdown>
            </div>`,
    });

    this.dropdown6 = new DemoComponentData({
      title: ``,
      source: `<fui-dropdown>
            <span style="display: inline-block; color: #000000;" fuiDropdownTrigger>
              Dropdown
              <clr-icon style="width: 9px; height: 9px;" shape="fui-caret" dir="down"></clr-icon>
            </span>
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
                    <fui-dropdown-menu>
                      <button fuiDropdownItem>Baz</button>
                    </fui-dropdown-menu>
                  </fui-dropdown>
                </fui-dropdown-menu>
              </fui-dropdown>
              <div fuiDropdownItem>Link 2</div>
            </fui-dropdown-menu>
          </fui-dropdown>`,
    });
  }
}
