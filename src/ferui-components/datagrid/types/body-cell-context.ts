import { Column } from '../components/entities/column';

export interface FuiDatagridBodyCellContext {
  column: Column;
  value: string;
  row: any;
}
