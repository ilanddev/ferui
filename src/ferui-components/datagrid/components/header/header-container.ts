import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnInit, Self } from '@angular/core';
import { FuiDatagridService } from '../../services/datagrid.service';

@Component({
  selector: 'fui-datagrid-header-container',
  template: `
    <ng-content select="fui-datagrid-header-row"></ng-content>`,
  host: {
    '[class.fui-datagrid-header-container]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiHeaderContainer implements OnInit {
  @HostBinding('attr.role') role: string = 'presentation';

  constructor(@Self() private elementRef: ElementRef, private gridPanel: FuiDatagridService) {}

  ngOnInit(): void {
    this.gridPanel.eHeaderContainer = this.elementRef.nativeElement;
  }
}
