export interface FuiDatagridBodyRowContext {
  rowHeight: number;
  rowIndex: number;
  rowData: any;
  isFirstRow: boolean;
  rowTopValue: number;
  appendTo: string;
  onDropdownOpen?: (isOpen: boolean) => void;
  forceClose?: boolean;
}
