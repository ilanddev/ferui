import { TemplateRef } from '@angular/core';
import { FuiDatagridSortDirections } from './sort-directions.enum';
import { FuiDatagridComparator } from './comparator';
import { FuiFieldTypes } from './field-types.enum';
import { FilterType } from '../components/filters/interfaces/filter.enum';
import { FuiDatagridBaseFilter } from '../components/filters/filter/base-filter';
import { IFilterParams } from '../components/filters/interfaces/filter';
import { FuiDatagridBodyRowContext } from './body-row-context';

export interface FuiColumnDefinitions {
  //The unique ID to give the column. This is optional.
  // If missing, the ID will default to the field.
  // If both field and colId are missing, a unique ID will be generated.
  // This ID is used to identify the column in the API for sorting, filtering etc.
  colId?: string;

  // The name to render in the column header. If not specified and field is specified, the field name would be used as the header name.
  headerName?: string;

  // The field of the row to get the cells data from
  field?: string;

  // Class to use for the header cell. Can be string, array of strings, or function.
  headerClass?: Array<string> | string;

  // A comma separated string or array of strings containing ColumnType keys which can be used as a template for a column.
  // This helps to reduce duplication of properties when you have a lot of common column properties.
  type?: Array<string> | string;

  // Set to true for this column to be hidden.
  // Naturally you might think, it would make more sense to call this field 'visible' and mark it false to hide,
  // however we want all default values to be false and we want columns to be visible by default.
  hide?: boolean;

  // Set to true to allow sorting on this column.
  sortable?: boolean;

  // If sorting by default, set it here. Set to 'asc',  'desc' or 'none'
  sort?: FuiDatagridSortDirections;

  // If the default comparator is not enough, you can use your own comparator.
  sortComparator?: FuiDatagridComparator;

  // The type of data for the field. It can be a string, number or Date.
  sortType?: FuiFieldTypes;

  sortOrder?: number;

  // Set to true to allow column to be resized.
  resizable?: boolean;

  // Boolean or Function. Set to true (or return true from function) to render a selection checkbox in the column.
  checkboxSelection?: boolean;

  // Class to use for the cell. Can be string, array of strings, or function.
  cellClass?: Array<string> | string;

  // Boolean or Function. Set to true (or return true from function) to render a row drag area in the column.
  rowDrag?: boolean;

  // cellRenderer to use for this column.
  cellRenderer?: TemplateRef<any>;

  // Tooltip for the column header
  headerTooltip?: any;

  // The field of the tooltip to apply to the cell.
  tooltipField?: string;

  suppressSizeToFit?: boolean;

  // A callback that takes (value, valueFormatted, data, node , colDef, rowIndex and api) It must return the string used as a tooltip. tooltipField takes precedence.
  tooltip?: (value: any, valueFormatted: string, data: any, colDef: FuiColumnDefinitions, rowIndex: number, api: any) => string;

  // Initial width, min width and max width for the cell. Always stated in pixels (never percentage values).
  width?: number;
  minWidth?: number;
  maxWidth?: number;

  // Set to true to make sure this column is always first. Other columns, if movable, cannot move before this column.
  lockPosition?: boolean;

  // Set to true to block the user showing / hiding the column, the column can only be shown / hidden via definitions or API
  lockVisible?: boolean;

  // one of the built in filter names: [date, number, text], or a boolean
  filter?: FilterType | boolean;

  filterFramework?: TemplateRef<FuiDatagridBaseFilter<IFilterParams>>;

  /** The filter params are specific to each filter! */
  filterParams?: IFilterParams;

  // The cell value formatter used to export the Datagrid to CSV, XLSX etc...
  exportValueFormatter?: (value: string, data?: any) => string;
}
