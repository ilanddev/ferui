import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'fui-datagrid-body-empty',
  template: `
    <div class="fui-body-empty-icon">
      <ng-container [ngTemplateOutlet]="emptyIcon ? emptyIcon : defaultEmptyIconTplt"></ng-container>
    </div>
    <div class="fui-body-empty-message">
      <ng-container [ngTemplateOutlet]="emptyMessage ? emptyMessage : defaultEmptyMessageTplt"></ng-container>
    </div>
    <ng-template #defaultEmptyIconTplt>
      <clr-icon class="fui-body-empty-icon-ico" shape="fui-empty"></clr-icon>
    </ng-template>
    <ng-template #defaultEmptyMessageTplt>
      <span>No results founds</span>
    </ng-template>
  `,
  host: {
    '[class.fui-datagrid-body-empty]': 'true'
  }
})
export class FuiBodyEmpty {
  @Input() emptyIcon: TemplateRef<any>;
  @Input() emptyMessage: TemplateRef<any>;
}
