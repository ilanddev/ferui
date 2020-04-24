import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { FuiTab } from './tab';

@Component({
  selector: 'fui-tabs',
  template: `
    <ul class="nav nav-pills mb-3" role="tablist">
      <li class="nav-item" role="tab" *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab)">
        <span class="nav-link" [class.active]="tab.active">
          <ng-container
            *ngIf="tab.titleTemplateOutletRef"
            [ngTemplateOutlet]="tab.titleTemplateOutletRef"
            [ngTemplateOutletContext]="tab.titleTemplateOutletContext"
          ></ng-container>
          <span *ngIf="!tab.titleTemplateOutletRef && tab.title">{{ tab.title }}</span>
          <span *ngIf="!tab.titleTemplateOutletRef && !tab.title">Tab {{ i }}</span>
        </span>
      </li>
    </ul>
    <div class="tab-content">
      <ng-content></ng-content>
    </div>
  `
})
export class FuiTabs implements AfterContentInit {
  @ContentChildren(FuiTab) tabs: QueryList<FuiTab>;

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: FuiTab) {
    if (!tab) {
      return;
    }
    // deactivate all tabs
    this.tabs.toArray().forEach(t => (t.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
