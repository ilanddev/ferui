import { FuiBodyRow } from '../../components/body/body-row';
import { FuiDatagridBodyRowContext } from '../../types/body-row-context';

/**
 * FuiActionMenuUtils class
 */
export class FuiActionMenuUtils {
  /**
   * Generate a simple action menu context to use.
   * This is used in place of the FuiDatagridBodyRow definition which is much more complex object.
   * This is for better memory consumption.
   */
  static getContextForActionMenu(row: FuiBodyRow): FuiDatagridBodyRowContext {
    return {
      rowHeight: row.rowHeight,
      rowIndex: row.rowIndex,
      rowData: row.data,
      rowTopValue: row.elementRef.nativeElement.offsetTop,
      isFirstRow: row.isFirstRow,
      appendTo: '#' + row.datagridId
    };
  }
}
