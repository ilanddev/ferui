import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnInit, Optional, Self } from '@angular/core';
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';

@Component({
  selector: 'fui-datagrid-body-container',
  template: `
    <ng-content select="fui-datagrid-body-row"></ng-content>
  `,
  host: {
    '[class.fui-datagrid-body-container]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiBodyContainer implements OnInit {
  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height.px') height: number = 0;

  constructor(
    @Self() public elementRef: ElementRef,
    @Optional() private rowRendererService: RowRendererService,
    @Optional() private optionsWrapperService: FuiDatagridOptionsWrapperService
  ) {}

  ngOnInit(): void {
    if (this.optionsWrapperService && this.optionsWrapperService.gridOptions && this.optionsWrapperService.gridOptions.rowData) {
      const rowHeight = this.optionsWrapperService.gridOptions.rowHeight;
      this.height = this.optionsWrapperService.gridOptions.rowData.length * rowHeight;
    }
  }
}
