import { BaseCreator } from './base-creator';
import { GridSerializer, GridSerializingSession } from './grid-serializer';
import { CsvExportParams } from './export-params';
import { Downloader } from './downloader';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';

export class CsvCreator extends BaseCreator<string, GridSerializingSession<string>, CsvExportParams> {
  constructor(
    downloader: Downloader,
    gridSerializer: GridSerializer<string>,
    gridOptionsWrapper: FuiDatagridOptionsWrapperService
  ) {
    super(downloader, gridSerializer, gridOptionsWrapper);
  }

  public getMimeType(): string {
    return 'text/csv;charset=utf-8;';
  }

  public getDefaultFileName(): string {
    return 'export.csv';
  }

  public getDefaultFileExtension(): string {
    return 'csv';
  }

  public isExportSuppressed(): boolean {
    return this.gridOptionsWrapper.isSuppressCsvExport();
  }

  public createSerializingSession(params?: CsvExportParams): GridSerializingSession<string> {
    return this.gridSerializer.gridSerializingSession();
  }
}
