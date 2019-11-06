import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { DemoComponent } from './demo.component';

/**
 * Class:  Demo-page.component.ts
 *
 * Description:
 * ---------------------------------
 * This component is building a Demo Page, it takes a pageTitle as parameter
 * and contains a list of Demo Components.
 *
 * Example:
 * ---------------------------------
 * <demo-page pageTitle="Widget Component">
 *   <demo-component [componentData]="examples[0]"></demo-component>
 *   <demo-component [componentData]="examples[1]"></demo-component>
 * </demo-page>
 *
 */
@Component({
  selector: 'demo-page',
  template: `
    <h2 class="mt-2 mb-2">{{ pageTitle }}</h2>
    <p class="mt-4" *ngIf="filtersDisplayed">
      Filters :
      <button class="btn btn-sm btn-info" *ngIf="canDisable" (click)="setDisable()">
        Toggle Disabled ({{ disabled ? 'true' : 'false' }})
      </button>
      <button class="btn btn-sm btn-info ml-2" (click)="toggleAllCodes()">Toggle all code</button>
      <button class="btn btn-sm btn-info ml-2" *ngIf="canToggleResults" (click)="toggleAllResults()">
        Toggle all results
      </button>
    </p>
    <ng-content></ng-content>
  `,
})
export class DemoPageComponent implements AfterContentInit {
  @ContentChildren(DemoComponent) demoComponents: QueryList<DemoComponent>;

  @Input() filtersDisplayed: boolean = false;
  @Input() pageTitle: string = 'Demo Page';
  @Input() disabled: boolean = false;

  canDisable: boolean = false;
  canToggleResults: boolean = false;

  ngAfterContentInit() {
    this.canDisable =
      this.disabled === true ||
      this.demoComponents.find(cmp => {
        return cmp.canDisable;
      }) !== undefined;

    this.canToggleResults =
      this.demoComponents.find(cmp => {
        return cmp.models !== undefined && Object.keys(cmp.models).length > 0;
      }) !== undefined;
  }

  toggleAllCodes() {
    this.demoComponents.forEach(cmp => {
      cmp.toggleCode();
    });
  }

  toggleAllResults() {
    this.demoComponents.forEach(cmp => {
      cmp.toggleResult();
    });
  }

  setDisable() {
    this.disabled = !this.disabled;
    this.demoComponents.forEach(cmp => {
      cmp.disable(this.disabled);
    });
  }
}
