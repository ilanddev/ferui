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
  OnDestroy,
  OnInit,
  Self,
  ViewChild
} from '@angular/core';
import { FuiDatagridService } from '../../services/datagrid.service';
import { FuiVirtualScrollerComponent } from '../../../virtual-scroller/virtual-scroller';
import { DatagridStateEnum, DatagridStateService } from '../../services/datagrid-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fui-datagrid-body',
  template: `
    <div
      class="fui-datagrid-body-cliper"
      [class.with-empty-data]="isEmptyData"
      [class.with-fixed-height]="isFixedheight"
      #bodyCliper
    >
      <div class="fui-grid-loading-wrapper" *ngIf="isLoading">
        <div class="fui-grid-loading-screen">
          <clr-icon class="fui-datagrid-loading-icon" shape="fui-spinner"></clr-icon>
        </div>
      </div>

      <fui-datagrid-body-empty *ngIf="!isLoading && isEmptyData"></fui-datagrid-body-empty>

      <ng-content select="fui-virtual-scroller" *ngIf="!isLoading && !isEmptyData"></ng-content>
      <ng-content></ng-content>
    </div>
    <div class="fui-datagrid-spacer-full-width" #viewportSpacer></div>
  `,
  host: {
    '[class.fui-datagrid-body]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiBodyRoot implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  @Input() isFixedheight: boolean = false;
  @Input() headerHeight: number = 50;

  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height') height: string;

  @ViewChild('viewportSpacer') viewportSpacer: ElementRef;
  @ViewChild('bodyCliper') bodyCliper: ElementRef;

  @ContentChild(FuiVirtualScrollerComponent) vcViewport: FuiVirtualScrollerComponent;

  private _isLoading: boolean = true;
  private _isEmptyData: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    @Self() private elementRef: ElementRef,
    private gridPanel: FuiDatagridService,
    private cd: ChangeDetectorRef,
    private stateService: DatagridStateService
  ) {
    // Each time we are updating the states, we need to run change detection.
    this.subscriptions.push(
      this.stateService.getCurrentStates().subscribe(() => {
        this.isLoading = this.stateService.hasState(DatagridStateEnum.LOADING);
        this.isEmptyData = this.stateService.hasState(DatagridStateEnum.EMPTY);
      })
    );

    // When we load the datagrid for the first time, we want to display the initial loading.
    this.stateService.setLoading();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set isLoading(value: boolean) {
    if (value !== this._isLoading) {
      this._isLoading = value;
      this.cd.markForCheck();
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set isEmptyData(value: boolean) {
    if (value !== this._isEmptyData) {
      this._isEmptyData = value;
      this.cd.markForCheck();
    }
  }

  get isEmptyData(): boolean {
    return this._isEmptyData;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = undefined;
  }
}
