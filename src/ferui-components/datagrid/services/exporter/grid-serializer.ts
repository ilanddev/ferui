import { Column } from '../../components/entities/column';
import { CsvExportParams, ExportParams } from './export-params';

const LINE_SEPARATOR = '\r\n';

export interface GridSerializingSession<T> {
  headers: T[];
  body: T[][];
  columnSeparator: string;
}

export interface GridSerializerOptions {
  includeHiddenColumns: boolean;
}

const DEFAULT_GRID_SERIALIZER_OPTIONS: GridSerializerOptions = {
  includeHiddenColumns: false
};

export class GridSerializer<T> {
  constructor(
    private _displayedColumns: Column[],
    private _displayedRows: T[],
    private readonly options?: GridSerializerOptions
  ) {
    if (this.options) {
      this.options = { ...DEFAULT_GRID_SERIALIZER_OPTIONS, ...this.options };
    } else {
      this.options = DEFAULT_GRID_SERIALIZER_OPTIONS;
    }
  }

  set displayedColumns(value: Column[]) {
    this._displayedColumns = value;
  }

  set displayedRows(value: T[]) {
    this._displayedRows = value;
  }

  gridSerializingSession(params?: CsvExportParams): GridSerializingSession<string> {
    const json: GridSerializingSession<string> = {
      headers: [],
      body: [],
      columnSeparator: params && params.columnSeparator ? params.columnSeparator : ';'
    };

    const filteredColumns: Column[] = this._displayedColumns.filter(col => {
      return (!this.options.includeHiddenColumns && col.isVisible()) || this.options.includeHiddenColumns;
    });
    for (const column of filteredColumns) {
      json.headers.push(column.name);
    }
    for (const row of this._displayedRows) {
      const rowData: string[] = [];
      for (const column of filteredColumns) {
        const valueFormattedCell: string | null = column.getExportValueFormatter(row[column.field], row);
        if (valueFormattedCell !== null) {
          rowData.push(valueFormattedCell);
        } else {
          rowData.push(row[column.field]);
        }
      }
      json.body.push(rowData);
    }

    return json;
  }

  serialize(gridSerializingSession: GridSerializingSession<T>, params?: ExportParams<T>): string {
    const skipHeader = params && params.skipHeader;
    const suppressQuotes = params && params.suppressQuotes;

    let result: string = '';
    if (!skipHeader) {
      const formattedHeaders: string[] = gridSerializingSession.headers.map(value => {
        return this.putInQuotes(value, suppressQuotes);
      });
      result += formattedHeaders.join(gridSerializingSession.columnSeparator) + LINE_SEPARATOR;
    }

    gridSerializingSession.body.forEach(row => {
      if (row && row.length > 0) {
        const formattedRow: string[] = row.map(value => {
          return this.putInQuotes(value, suppressQuotes);
        });
        result += formattedRow.join(gridSerializingSession.columnSeparator) + LINE_SEPARATOR;
      }
    });

    return result;
  }

  protected putInQuotes(value: any, suppressQuotes: boolean): string {
    if (suppressQuotes) {
      return value;
    }

    if (value === null || value === undefined) {
      return '""';
    }

    let stringValue: string;
    if (typeof value === 'string') {
      stringValue = value;
    } else if (typeof value.toString === 'function') {
      stringValue = value.toString();
    } else {
      console.warn('unknown value type during csv conversion');
      stringValue = '';
    }

    // replace each " with "" (ie two sets of double quotes is how to do double quotes in csv)
    const valueEscaped = stringValue.replace(/"/g, '""');

    return '"' + valueEscaped + '"';
  }
}
