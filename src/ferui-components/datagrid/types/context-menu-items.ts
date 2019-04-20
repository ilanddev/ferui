import { FuiDatagridApiService } from '../services/datagrid-api.service';
import { FuiDatagridColumnApiService } from '../services/datagrid-column-api.service';

export interface GetContextMenuItemsParams {
  defaultItems: string[] | undefined;
  column: string;
  value: any;
  api: FuiDatagridApiService | null | undefined;
  columnApi: FuiDatagridColumnApiService | null | undefined;
  context: any;
}

export interface GetContextMenuItems {
  (params: GetContextMenuItemsParams): (string | MenuItemDef)[];
}

export interface MenuItemDef {
  name: string;
  disabled?: boolean;
  shortcut?: string;
  action?: () => void;
  checked?: boolean;
  icon?: HTMLElement | string;
  subMenu?: (MenuItemDef | string)[];
  cssClasses?: string[];
  tooltip?: string;
}
