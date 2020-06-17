export interface FuiDatagridBodyRowContext {
  // The row height
  rowHeight: number;
  // The row Index
  rowIndex: number;
  // The row data. It will contains the API data for the specific row.
  rowData: any;
  // Whether or not it is the first row in the datagrid.
  isFirstRow: boolean;
  // If for any reason you need to know the top value of the specific row.
  // Can be useful if you're using custom action-menu dropdown.
  rowTopValue: number;
  // If you want to append the action-menu to a different container, like the body or whatever else.
  // By default, the action-menu will automatically assign this property to body.
  appendTo: string;
  // Callback for when the dropdown menu is opening. Useful for adding extra design to the row (i.e: hovering state).
  onDropdownOpen?: (isOpen: boolean) => void;
  // This will force the action menu to close its dropdown (if any).
  forceClose?: boolean;
}
