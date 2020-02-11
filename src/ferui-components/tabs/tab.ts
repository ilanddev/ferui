import { Component, HostBinding, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'fui-tab',
  template: `
    <ng-container
      *ngIf="templateOutletRef"
      [ngTemplateOutlet]="templateOutletRef"
      [ngTemplateOutletContext]="templateOutletContext"
    ></ng-container>
    <ng-content></ng-content>
  `,
  host: {
    '[class.tab-pane]': 'true',
    '[class.active]': 'active',
    '[class.show]': 'active',
    '[class.fade]': 'true'
  }
})
export class FuiTab {
  @HostBinding('attr.role') tabRole: string = 'tabpanel';
  @Input() title: string;
  @Input() active: boolean = false;

  @Input() templateOutletRef: TemplateRef<any>;
  @Input() templateOutletContext: Object = {};
}
