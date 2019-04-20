import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnInit, Self } from '@angular/core';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';
import { FuiDatagridService } from '../../services/datagrid.service';

@Component({
  selector: 'fui-datagrid-header-viewport',
  template: `
    <ng-content select="fui-datagrid-header-container"></ng-content>`,
  host: {
    '[class.fui-datagrid-header-viewport]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiHeaderViewport implements OnInit {
  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height.px') headerHeight: number = 0;

  constructor(
    @Self() private elementRef: ElementRef,
    private gridPanel: FuiDatagridService,
    private optionsWrapperService: FuiDatagridOptionsWrapperService
  ) {}

  ngOnInit(): void {
    if (this.optionsWrapperService && this.optionsWrapperService.gridOptions) {
      this.headerHeight = this.optionsWrapperService.gridOptions.headerHeight;
    }
    this.gridPanel.eHeaderViewport = this.elementRef.nativeElement;
  }
}
