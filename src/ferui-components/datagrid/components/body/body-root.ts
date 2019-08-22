import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Self,
  ViewChild,
} from '@angular/core';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiVirtualScrollerComponent } from '../../../virtual-scroller/virtual-scroller';

@Component({
  selector: 'fui-datagrid-body',
  template: `
    <div class="fui-datagrid-body-cliper" #bodyCliper>
      <div class="fui-grid-loading-screen" *ngIf="isLoading">
        <clr-icon class="fui-datagrid-loading-icon" shape="fui-spinner"></clr-icon>
      </div>
      <ng-content select="fui-virtual-scroller" *ngIf="!isLoading"></ng-content>
      <ng-content></ng-content>
    </div>
    <div class="fui-datagrid-spacer-full-width" #viewportSpacer></div>
  `,
  host: {
    '[class.fui-datagrid-body]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiBodyRoot implements OnInit, AfterViewInit, AfterContentInit {
  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height') height: string;

  @Input() isLoading: boolean = false;
  @Input() headerHeight: number = 50;

  @ViewChild('viewportSpacer') viewportSpacer: ElementRef;
  @ViewChild('bodyCliper') bodyCliper: ElementRef;

  @ContentChild(FuiVirtualScrollerComponent) vcViewport: FuiVirtualScrollerComponent;

  constructor(
    @Self() private elementRef: ElementRef,
    private gridPanel: FuiDatagridService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.gridPanel.eBodyViewport = this.elementRef.nativeElement;
    this.height = `calc(100% - ${this.headerHeight})`;
    this.cd.markForCheck();
  }

  ngAfterContentInit(): void {
    this.gridPanel.virtualScrollViewport = this.vcViewport;
    this.gridPanel.eCenterViewport = this.vcViewport.element.nativeElement;
    this.gridPanel.eCenterContainer = this.vcViewport.contentElementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.gridPanel.eFullWidthContainer = this.viewportSpacer.nativeElement;
    this.gridPanel.eCenterColsClipper = this.bodyCliper.nativeElement;
  }
}
