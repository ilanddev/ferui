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
import { RowRendererService } from '../../services/rendering/row-renderer.service';
import { FuiActionMenuService } from '../../services/action-menu/action-menu.service';
import { FuiBodyRow } from './body-row';
import { FeruiUtils } from '../../../utils/ferui-utils';
import { FuiActionMenuUtils } from '../../services/action-menu/action-menu-utils';

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
  @Input() rowHeight: number = 50;
  @Input() hasActionMenu: boolean;

  @HostBinding('attr.role') role: string = 'presentation';
  @HostBinding('style.height') height: string;

  @ViewChild('viewportSpacer') viewportSpacer: ElementRef;
  @ViewChild('bodyCliper') bodyCliper: ElementRef;

  @ContentChild(FuiVirtualScrollerComponent) vcViewport: FuiVirtualScrollerComponent;

  private _isLoading: boolean = true;
  private _isEmptyData: boolean = false;
  private currentlyHoveredRow: FuiBodyRow;
  private subscriptions: Subscription[] = [];
  private onMoveFunc;
  private onLeaveFunc;
  private isMouseHoverARow: boolean = false;
  private latestMouseEvent: MouseEvent;

  constructor(
    @Self() private elementRef: ElementRef,
    private gridPanel: FuiDatagridService,
    private cd: ChangeDetectorRef,
    private stateService: DatagridStateService,
    private rowRendererService: RowRendererService,
    private actionMenuService: FuiActionMenuService
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

  ngAfterViewInit(): void {
    this.gridPanel.eFullWidthContainer = this.viewportSpacer.nativeElement;
    this.gridPanel.eCenterColsClipper = this.bodyCliper.nativeElement;
  }

  ngAfterContentInit(): void {
    this.gridPanel.virtualScrollViewport = this.vcViewport;
    this.gridPanel.eCenterViewport = this.vcViewport.element.nativeElement;
    this.gridPanel.eCenterContainer = this.vcViewport.contentElementRef.nativeElement;

    if (this.hasActionMenu) {
      this.onMoveFunc = this.onMouseMove.bind(this);
      this.onLeaveFunc = this.onMouseLeave.bind(this);
      this.addContainerListeners();

      this.subscriptions.push(
        this.actionMenuService.actionMenuHoverChange().subscribe(isActionMenuHovered => {
          if (!isActionMenuHovered) {
            const relatedTarget: Element = this.actionMenuService.event.relatedTarget as Element;
            if (relatedTarget.classList.contains('fui-datagrid-body-viewport')) {
              this.onLeaveFunc(this.actionMenuService.event, 'relatedTarget');
            } else {
              this.onLeaveFunc(this.actionMenuService.event, 'target');
            }
          }
        }),
        this.actionMenuService.actionMenuOpenChange().subscribe(isOpen => {
          const currentlySelectedRowContextIndex: number = this.actionMenuService.currentlySelectedRowContext.rowIndex || null;
          if (
            !isOpen &&
            (!this.isMouseHoverARow ||
              currentlySelectedRowContextIndex === null ||
              (currentlySelectedRowContextIndex &&
                this.currentlyHoveredRow &&
                this.currentlyHoveredRow.rowIndex !== currentlySelectedRowContextIndex))
          ) {
            this.actionMenuService.isActionMenuVisible = false;
            this.currentlyHoveredRow = undefined;
          }

          if (isOpen) {
            this.addBodyListeners();
          } else {
            this.removeBodyListeners();
            // Once we close the action menu we reset the action menu icon position depending on the last known MouseEvent.
            this.onMoveFunc(this.latestMouseEvent);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = undefined;
    if (this.hasActionMenu) {
      this.removeBodyListeners(true);
      this.removeContainerListeners();
    }
  }

  /**
   * The the currently hovered row index.
   * @param event
   */
  private getCurrentlyHoveredRowIndex(event: MouseEvent): number {
    const vcViewportElement: HTMLElement = this.vcViewport.element.nativeElement;
    const scrollTop: number = vcViewportElement.scrollTop;
    const rect = this.bodyCliper.nativeElement.getBoundingClientRect();
    return Math.floor((event.clientY - rect.top + scrollTop) / this.rowHeight);
  }

  /**
   * Whether of not the mouse cursor is hovering a row.
   * @param event
   */
  private isMouseHoverRow(event: MouseEvent): boolean {
    const rect = this.bodyCliper.nativeElement.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const yMin: number = rect.top;
    const xMin: number = rect.left;
    const yMax: number = yMin + rect.height;
    const xMax: number = xMin + rect.width;
    this.isMouseHoverARow = mouseX >= xMin && mouseX <= xMax && mouseY >= yMin && mouseY <= yMax;
    return this.isMouseHoverARow;
  }

  /**
   * Add mousemove listener over the whole container so that we can display the action menu when needed.
   */
  private addContainerListeners(): void {
    this.vcViewport.contentElementRef.nativeElement.addEventListener('mousemove', this.onMoveFunc);
    this.vcViewport.contentElementRef.nativeElement.addEventListener('mouseleave', this.onLeaveFunc);
  }

  /**
   * Remove the listeners of the container.
   */
  private removeContainerListeners(): void {
    this.vcViewport.contentElementRef.nativeElement.removeEventListener('mousemove', this.onMoveFunc);
    this.vcViewport.contentElementRef.nativeElement.removeEventListener('mouseleave', this.onLeaveFunc);
  }

  /**
   * Add listeners over the whole body so that we can display/hide the action menu when it is open.
   * We will remove the container listeners so that we have only one listener at a time.
   */
  private addBodyListeners(): void {
    document.body.addEventListener('mousemove', this.onMoveFunc);
    document.body.addEventListener('click', this.onMoveFunc);
    this.removeContainerListeners();
  }

  /**
   * Remove listeners over the whole body so that we can hide the action menu when it
   * is close and the cursor is outside the container. We will re-activate the container listeners.
   * @param clear If you only want to clear the listeners without re-activating the container listeners.
   */
  private removeBodyListeners(clear: boolean = false): void {
    document.body.removeEventListener('mousemove', this.onMoveFunc);
    document.body.removeEventListener('click', this.onMoveFunc);
    if (!clear) {
      this.addContainerListeners();
    }
  }

  /**
   * Handle the mousemove event.
   * @param event
   */
  private onMouseMove(event: MouseEvent): void {
    const rowIndex = this.getCurrentlyHoveredRowIndex(event);
    this.latestMouseEvent = event;
    if (!this.isMouseHoverRow(event) && !this.actionMenuService.isActionMenuDropdownOpen) {
      this.currentlyHoveredRow = undefined;
      this.actionMenuService.setSelectedRowContext(null);
      this.actionMenuService.isActionMenuVisible = false;
    } else if (!this.currentlyHoveredRow || (this.currentlyHoveredRow && rowIndex !== this.currentlyHoveredRow.rowIndex)) {
      this.currentlyHoveredRow = this.rowRendererService.getRowByIndex(rowIndex);
      this.onRowEnter();
    }
  }

  /**
   * Handle mouseleave event.
   * @param event
   * @param target
   */
  private onMouseLeave(event: MouseEvent, target: string = 'relatedTarget'): void {
    // When hovering the row, you won't leave the datagrid, but if you're hovering the action-menu,
    // you'll then leave the datagrid-body since the action-menu will be located at a higher level than the datagrid root.
    // But you shouldn't hide the action-menu when hovering the action-menu itself.
    const relatedTarget: Element = event[target] as Element;
    const isMouseOverRow: boolean = this.isMouseHoverRow(event);
    const isActionMenuOpen: boolean = this.actionMenuService.isActionMenuDropdownOpen;
    if (!relatedTarget) {
      return;
    }
    const onRowActionMenu: boolean = !!FeruiUtils.getClosestDomElement(relatedTarget, 'fui-datagrid-body-row-action-menu');
    // The relatedTarget can be anything, not only the action-menu.
    // So we check if it is a Datagrid action-menu.
    // And if it is not an action-menu, then it means that the mouse has leaved the Datagrid and
    // that we need to hide the action-menu.
    if ((!isMouseOverRow && !isActionMenuOpen) || (isMouseOverRow && !isActionMenuOpen && !onRowActionMenu)) {
      this.actionMenuService.isActionMenuVisible = false;
      this.currentlyHoveredRow = undefined;
      this.actionMenuService.setSelectedRowContext(null);
    }
  }

  /**
   * This is called when the user have his cursor over a row.
   */
  private onRowEnter(): void {
    if (!this.currentlyHoveredRow) {
      return;
    }
    this.actionMenuService.setSelectedRowContext(FuiActionMenuUtils.getContextForActionMenu(this.currentlyHoveredRow));
    this.actionMenuService.isActionMenuVisible = true;
    this.cd.markForCheck();
  }
}
