import { Injectable } from '@angular/core';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FuiActionMenuService {
  private _isActionMenuVisible: boolean = false;
  private _isActionMenuDropdownOpen: boolean = false;
  private _isActionMenuHovered: boolean = false;
  private _curentlySelectedRowContext: FuiDatagridBodyRowContext = null;

  private _curentlySelectedRowContext$: Subject<FuiDatagridBodyRowContext> = new Subject<FuiDatagridBodyRowContext>();
  private _actionMenuDropdownOpen$: Subject<boolean> = new Subject<boolean>();
  private _actionMenuVisible$: Subject<boolean> = new Subject<boolean>();
  private _actionMenuHovered$: Subject<boolean> = new Subject<boolean>();

  get curentlySelectedRowContext(): FuiDatagridBodyRowContext {
    return this._curentlySelectedRowContext;
  }

  set curentlySelectedRowContext(value: FuiDatagridBodyRowContext) {
    this._curentlySelectedRowContext = value;
    this._curentlySelectedRowContext$.next(value);
  }

  get isActionMenuHovered(): boolean {
    return this._isActionMenuHovered;
  }

  set isActionMenuHovered(value: boolean) {
    this._isActionMenuHovered = value;
    this._actionMenuHovered$.next(value);
  }

  get isActionMenuDropdownOpen(): boolean {
    return this._isActionMenuDropdownOpen;
  }

  set isActionMenuDropdownOpen(value: boolean) {
    this._isActionMenuDropdownOpen = value;
    this._actionMenuDropdownOpen$.next(value);
  }

  get isActionMenuVisible(): boolean {
    return this._isActionMenuVisible;
  }

  set isActionMenuVisible(value: boolean) {
    this._isActionMenuVisible = value;
    this._actionMenuVisible$.next(value);
  }

  selectedRowContextChange(): Observable<FuiDatagridBodyRowContext> {
    return this._curentlySelectedRowContext$.asObservable();
  }

  actionMenuHoverChange(): Observable<boolean> {
    return this._actionMenuHovered$.asObservable();
  }

  actionMenuVisibilityChange(): Observable<boolean> {
    return this._actionMenuVisible$.asObservable();
  }

  actionMenuOpenChange(): Observable<boolean> {
    return this._actionMenuDropdownOpen$.asObservable();
  }

  setSelectedRowContext(context: FuiDatagridBodyRowContext, remove: boolean = false): void {
    // Do nothing if one dropdown is already opened.
    if (this.isActionMenuDropdownOpen) {
      return;
    }
    if (
      this.curentlySelectedRowContext === null ||
      (this.curentlySelectedRowContext && context && context.rowIndex !== this.curentlySelectedRowContext.rowIndex)
    ) {
      this.curentlySelectedRowContext = context;
    } else if (remove) {
      this.curentlySelectedRowContext = null;
    }
  }
}
