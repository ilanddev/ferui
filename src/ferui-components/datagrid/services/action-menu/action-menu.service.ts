import { Injectable } from '@angular/core';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FuiActionMenuService {
  // We store the latest mouseEvent in this service for later use.
  event: MouseEvent = null;

  private _isActionMenuVisible: boolean = false;
  private _isActionMenuDropdownOpen: boolean = false;
  private _isActionMenuHovered: boolean = false;
  private _currentlySelectedRowContext: FuiDatagridBodyRowContext = null;

  private _currentlySelectedRowContext$: Subject<FuiDatagridBodyRowContext> = new Subject<FuiDatagridBodyRowContext>();
  private _actionMenuDropdownOpen$: Subject<boolean> = new Subject<boolean>();
  private _actionMenuVisible$: Subject<boolean> = new Subject<boolean>();
  private _actionMenuHovered$: Subject<boolean> = new Subject<boolean>();

  get currentlySelectedRowContext(): FuiDatagridBodyRowContext {
    return this._currentlySelectedRowContext;
  }

  set currentlySelectedRowContext(value: FuiDatagridBodyRowContext) {
    this._currentlySelectedRowContext = value;
    this._currentlySelectedRowContext$.next(value);
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
    if (value !== this._isActionMenuDropdownOpen) {
      this._isActionMenuDropdownOpen = value;
      this._actionMenuDropdownOpen$.next(value);
    }
  }

  get isActionMenuVisible(): boolean {
    return this._isActionMenuVisible;
  }

  set isActionMenuVisible(value: boolean) {
    this._isActionMenuVisible = value;
    this._actionMenuVisible$.next(value);
  }

  /**
   * Set the hover state. When the user is hovering the action-menu wrapper.
   * @param state
   * @param event
   */
  setHoverState(state: boolean, event: MouseEvent) {
    this.event = event;
    this.isActionMenuHovered = state;
  }

  /**
   * The observable to track any changes to the row context object.
   */
  selectedRowContextChange(): Observable<FuiDatagridBodyRowContext> {
    return this._currentlySelectedRowContext$.asObservable();
  }

  /**
   * The observable to track any changes when the user is entering/leaving the action-menu wrapper.
   */
  actionMenuHoverChange(): Observable<boolean> {
    return this._actionMenuHovered$.asObservable();
  }

  /**
   * The observable to track any changes when the action-menu wrapper become visible or hidden.
   */
  actionMenuVisibilityChange(): Observable<boolean> {
    return this._actionMenuVisible$.asObservable();
  }

  /**
   * The observable to track any changes when the action-menu dropdown is open.
   */
  actionMenuOpenChange(): Observable<boolean> {
    return this._actionMenuDropdownOpen$.asObservable();
  }

  /**
   * Set the selected row context.
   * @param context
   */
  setSelectedRowContext(context: FuiDatagridBodyRowContext): void {
    // Do nothing if one dropdown is already opened.
    if (this.isActionMenuDropdownOpen) {
      return;
    }
    if (
      this.currentlySelectedRowContext === null ||
      (this.currentlySelectedRowContext && context && context.rowIndex !== this.currentlySelectedRowContext.rowIndex)
    ) {
      this.currentlySelectedRowContext = context;
    } else if (!context) {
      this.currentlySelectedRowContext = null;
    }
  }
}
