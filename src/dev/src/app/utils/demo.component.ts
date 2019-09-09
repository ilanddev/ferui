import {
  AfterContentInit,
  AfterViewInit,
  Compiler,
  Component,
  Input,
  NgModule,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  ModuleWithComponentFactories,
  ComponentFactory,
  OnInit,
  TemplateRef,
  ViewChildren,
  QueryList,
  ContentChildren,
} from '@angular/core';
import { FeruiModule } from '@ferui/components';
import { FormsModule, NgControl, NgForm, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as jsBeautify from 'js-beautify';
import { DemoComponentData } from './demo-component-data';
import { IconsModule } from '../icons/icons.module';
import { WINDOW_PROVIDERS } from '../services/window.service';

/**
 * Class:  Demo.component.ts
 *
 * Description:
 * ---------------------------------
 * This class is building a Demo Component and takes a DemoComponentData object as parameter.
 *
 *
 * Example:
 * ---------------------------------
 * new DemoComponentData({
 *  title: 'Simple Widget',
 *  models: {one: 'one'},
 *  params: {value: 'value'},
 *  canDisable: true,
 *  source: `<fui-widget>
 *             <fui-widget-title>My title</fui-widget-title>
 *             <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
 *             <input fuiInput name="myField" [(ngModel)]="models.one" required />
 *             My value: {{params.value}}
 *           </fui-widget>`
 *  }));
 *
 *
 * The "#code" attribute:
 * ----------------------------------
 * If you want to only include a specific part of the source code in the source code preview area,
 * you can  use the "#code" attribute on one or multiple specific elements of your source code.
 * Only elements having this attribute will be displayed in Code section.
 * If this attribute is not used, the entire code will be displayed.
 *
 * new DemoComponentData({
 *  title: 'Simple Widget',
 *  ...
 *  source: `<fui-widget>
 *             <fui-widget-title>My title</fui-widget-title>
 *             <fui-widget-subtitle>Widget subtitle</fui-widget-subtitle>
 *
 *             <div #code>  <!-- Only this element and his content will be displayed in code preview area -->
 *               <input fuiInput name="myField" [(ngModel)]="models.one" required />
 *               My value: {{params.value}}
 *             </div>
 *           </fui-widget>`
 *  }));
 */
@Component({
  selector: 'demo-component',
  template: `
    <div class="row">
      <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
        <h5 class="mt-3">
          <span [innerHTML]="title"></span>
          <span *ngIf="canDisable && models">
            (<button class="btn btn-link p-0" (click)="disable(!this.params.disabled)">
              {{ this.params.disabled ? 'Enable' : 'Disable' }}</button
            >)
          </span>
        </h5>
        <div #container></div>
      </div>
      <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12" *ngIf="sourceCode && !models">
        <h5 class="mt-3">
          Code (
          <button class="btn btn-link p-0" (click)="toggleCode()">{{ codeHidden ? 'View Code' : 'Hide Code' }}</button>
          )
        </h5>
        <pre *ngIf="!codeHidden"><code [languages]="['xml']" [highlight]="codeBlock"></code></pre>
      </div>
    </div>
    <!--Second row if models are provided and results are available-->
    <div class="row pt-3" *ngIf="sourceCode && models">
      <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
        <p>
          Data (
          <button class="btn btn-link p-0" (click)="toggleResult()">{{ resultHidden ? 'View Data' : 'Hide Data' }}</button>
          )
        </p>
        <pre *ngIf="!resultHidden"><code [languages]="['json']" [highlight]="resultsData() | json"></code></pre>
      </div>
      <div class="col-md-6 col-lg-6 col-xl-6 col-sm-12">
        <p>
          Code (
          <button class="btn btn-link p-0" (click)="toggleCode()">{{ codeHidden ? 'View Code' : 'Hide Code' }}</button>
          )
        </p>
        <pre *ngIf="!codeHidden"><code [languages]="['xml']" [highlight]="codeBlock"></code></pre>
      </div>
    </div>
  `,
})
export class DemoComponent implements OnInit {
  @Input() componentData: DemoComponentData;
  @Input() disabled: boolean = false;
  @Input() codeHidden: boolean = false;
  @Input() resultHidden: boolean = false;
  @Input() form: NgForm;

  @ViewChild('container', { read: ViewContainerRef }) _vcr: ViewContainerRef;

  title: string;
  sourceCode: string;
  models: object;
  params: any;
  canDisable: boolean;
  codeBlock: string;

  private _componentRef: ComponentRef<any>;

  constructor(private _compiler: Compiler) {}

  ngOnInit(): void {
    this.title = this.componentData.title;
    this.sourceCode = this.componentData.source;
    this.models = this.componentData.models;
    this.params = this.componentData.params;
    this.canDisable = this.componentData.canDisable;

    if (!this.params.disabled) {
      this.params.disabled = this.disabled;
    }

    const codeBlocks = this.extractCodeBlocks(this.sourceCode);
    this.codeBlock = jsBeautify.html(codeBlocks.length > 0 ? codeBlocks.join('') : this.sourceCode);

    const _params: any = this.params;
    const _models: any = this.models;
    const _form: NgForm = this.form;

    class DemoSubComponent implements AfterViewInit {
      params: any = _params;
      models: any = _models;
      form: NgForm = _form;

      @ViewChildren(NgControl) formControls: QueryList<NgControl>;

      ngAfterViewInit(): void {
        if (this.form && this.formControls.length > 0) {
          this.formControls.forEach(control => {
            if (control instanceof NgModel) {
              this.form.addControl(control);
            }
          });
        }
      }
    }
    this.compileTemplate(this.sourceCode, DemoSubComponent);
  }

  resultsData() {
    const data: any = {};
    if (this.canDisable) {
      data.params = { disabled: this.params.disabled };
    }
    data.models = {};
    for (const modelName in this.models) {
      if (modelName) {
        data.models[modelName] = this.models[modelName];
      }
    }
    return data;
  }

  concatResultModels(models: any): Array<any> {
    const results: Array<any> = [];
    for (const modelName in models) {
      if (modelName) {
        results.push({
          'field-name': modelName,
          value: models[modelName],
        });
      }
    }
    return results;
  }

  toggleCode() {
    this.codeHidden = !this.codeHidden;
  }

  toggleResult() {
    this.resultHidden = !this.resultHidden;
  }

  disable(disabled: boolean) {
    if (this.canDisable) {
      this.params.disabled = disabled;
    }
  }

  private compileTemplate(template, componentClass?: any) {
    const metadata = {
      selector: `runtime-component-sample`,
      template: template,
    };
    const factory = this.createComponentFactorySync(this._compiler, metadata, componentClass);
    if (this._componentRef) {
      this._componentRef.destroy();
      this._componentRef = null;
    }
    this._componentRef = this._vcr.createComponent(factory);
  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent {};
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({
      imports: [BrowserAnimationsModule, CommonModule, FormsModule, IconsModule, FeruiModule],
      declarations: [decoratedCmp],
      providers: [WINDOW_PROVIDERS],
    })
    class RuntimeComponentModule {}

    const module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }

  /**
   * Extract from source code elements that have the #code attribute.
   * @param code Source code
   */
  private extractCodeBlocks(code: string) {
    const el = document.createElement('div');
    el.innerHTML = code;
    let codeBlocks = this.getAllElementsWithAttributeOrClass('#code', 'code', el);
    if (codeBlocks.length > 0) {
      codeBlocks = codeBlocks.map(block => block.outerHTML);
    }
    el.remove();
    return codeBlocks;
  }

  /**
   * Get HTML elements that have the specified attribute
   * @param attribute
   * @param klass
   * @param html
   * @return Array[HtmlElement] Array of matching HTML elements
   */
  private getAllElementsWithAttributeOrClass(attribute: string, klass: string, html: HTMLElement) {
    const matchingElements = [];
    const allElements = html.getElementsByTagName('*');
    for (let i = 0, n = allElements.length; i < n; i++) {
      const element = allElements[i];
      if (element.getAttribute(attribute) !== null) {
        // Element exists with attribute. Add to array.
        element.removeAttribute(attribute);
        matchingElements.push(element);
      } else if (element.classList.contains(klass)) {
        // Element exists with attribute. Add to array.
        const classList = element.classList;
        classList.remove(klass);
        matchingElements.push(element);
      }
    }

    return matchingElements;
  }
}
