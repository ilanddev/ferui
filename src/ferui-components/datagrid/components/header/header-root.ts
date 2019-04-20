import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, OnInit, Self } from '@angular/core';
import { FuiDatagridService } from '../../services/datagrid.service';

@Component({
  selector: 'fui-datagrid-header',
  template: `
    <ng-content select="fui-datagrid-header-viewport"></ng-content>`,
  host: {
    '[class.fui-datagrid-header]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiHeaderRoot implements OnInit {
  @HostBinding('attr.role') role: string = 'presentation';

  constructor(@Self() private elementRef: ElementRef, private gridPanel: FuiDatagridService) {}

  ngOnInit(): void {
    this.gridPanel.eHeaderRoot = this.elementRef.nativeElement;
  }
}
