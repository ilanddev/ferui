export interface FuiDatagridBodyRowContext {
  rowHeight: number;
  rowIndex: number;
  rowData: any;
  isFirstRow: boolean;
  rowTopValue: number;
  onDropdownOpen?: (isOpen: boolean) => void;
}
