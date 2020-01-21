import { Column } from '../../components/entities/column';

export interface BaseExportParams {
  skipHeader?: boolean;
  skipFooters?: boolean;
  suppressQuotes?: boolean;
  columnKeys?: (string | Column)[];
  fileName?: string;
}

export interface ExportParams<T> extends BaseExportParams {
  customHeader?: T;
  customFooter?: T;
}

export interface CsvExportParams extends ExportParams<string> {
  columnSeparator?: string;
}
