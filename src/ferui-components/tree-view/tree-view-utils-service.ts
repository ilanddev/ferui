import { EventEmitter, Injectable } from '@angular/core';
import { TreeViewColorTheme } from './interfaces';

@Injectable()
export class FuiTreeViewUtilsService {
  // Event emitter to update vs width when needed
  public treeViewScrollWidthChange: EventEmitter<void> = new EventEmitter<void>();
  private currentVsWidth: number = 0;

  /**
   * Set a new virtual scroller width if tree node width passed in is greater than
   * @param {number} treeNodeWidth
   */
  set virtualScrollerWidth(treeNodeWidth: number) {
    if (treeNodeWidth > this.currentVsWidth) {
      this.currentVsWidth = treeNodeWidth;
      this.treeViewScrollWidthChange.emit();
    }
  }

  /**
   * Gets the current virtual scroller width
   * @returns {number}
   */
  get virtualScrollerWidth(): number {
    return this.currentVsWidth;
  }

  /**
   * Set the initial default virtual scroller width
   *
   * @param {number} defaultWidth
   */
  set defaultScrollerWidth(defaultWidth: number) {
    this.currentVsWidth = defaultWidth;
  }
}
