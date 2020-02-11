import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  TemplateRef
} from '@angular/core';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';
import { FuiActionMenuService } from '../../services/action-menu/action-menu.service';
import { Subscription } from 'rxjs';
import { FuiDatagridOptionsWrapperService } from '../../services/datagrid-options-wrapper.service';

@Component({
  selector: 'fui-datagrid-action-menu',
  template: `
    <ng-container [ngTemplateOutlet]="actionMenuTemplate" [ngTemplateOutletContext]="getContextForActionMenu()"></ng-container>
  `,
  host: {
    class: 'fui-datagrid-body-row-action-menu',
    '[class.fui-datagrid-action-menu-visible]': 'isActionMenuVisible || isActionMenuDropdownOpen',
    '[class.fui-datagrid-action-menu-open]': 'isActionMenuDropdownOpen'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuiDatagridActionMenu implements OnDestroy {
  @Input('actionMenuTemplate') actionMenuTemplate: TemplateRef<FuiDatagridBodyRowContext>;
  @Input() maxDisplayedRows: number;

  isActionMenuVisible: boolean = false;
  isActionMenuDropdownOpen: boolean = false;

  private subscriptions: Subscription[] = [];
  private _actionMenuTopValue: string = 'translate3d(0, 0, 0)';
  private forceClose: boolean = false;
  private mouseLeaveTimeout: NodeJS.Timer;

  constructor(
    private actionMenuService: FuiActionMenuService,
    private cd: ChangeDetectorRef,
    private datagridOptionsWrapper: FuiDatagridOptionsWrapperService
  ) {
    this.isActionMenuVisible = this.actionMenuService.isActionMenuVisible;
    this.isActionMenuDropdownOpen = this.actionMenuService.isActionMenuDropdownOpen;
    this.subscriptions.push(
      this.actionMenuService.actionMenuVisibilityChange().subscribe(isVisible => {
        this.isActionMenuVisible = isVisible;
        this.cd.markForCheck();
      }),
      this.actionMenuService.actionMenuOpenChange().subscribe(isOpen => {
        this.isActionMenuDropdownOpen = isOpen;
        this.forceClose = !isOpen;
        this.cd.markForCheck();
      }),

      this.actionMenuService.selectedRowContextChange().subscribe(context => {
        if (context) {
          const offsetTopValue: number = this.datagridOptionsWrapper.gridApi.getViewportContentOffsetTop();
          this.actionMenuTopValue = `translate3d(0, ${context.rowTopValue + offsetTopValue}px, 0)`;
        } else {
          this.actionMenuTopValue = `translate3d(0, 0, 0)`;
        }
        this.cd.markForCheck();
      })
    );
  }

  get actionMenuTopValue(): string {
    return this._actionMenuTopValue;
  }

  @HostBinding('style.transform')
  set actionMenuTopValue(value: string) {
    this._actionMenuTopValue = value;
    this.cd.markForCheck();
  }

  @HostListener('mouseenter', ['$event'])
  onRowEnter(event) {
    this.actionMenuService.isActionMenuHovered = true;
  }

  @HostListener('mouseleave', ['$event'])
  onRowLeave(event) {
    this.actionMenuService.isActionMenuHovered = false;
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = undefined;
    }
  }

  // This function need to be declare like this because it is used within the actionMenu context.
  onDropdownOpen = (isOpen: boolean) => {
    if (this.actionMenuService) {
      this.actionMenuService.isActionMenuDropdownOpen = isOpen;
    }
  };

  getContextForActionMenu(): FuiDatagridBodyRowContext {
    if (this.actionMenuService) {
      return {
        ...this.actionMenuService.curentlySelectedRowContext,
        forceClose: this.forceClose,
        onDropdownOpen: this.onDropdownOpen
      };
    }
    return null;
  }
}
