import { Downloader } from './downloader';
import { GridSerializer, GridSerializingSession } from './grid-serializer';
import { BaseExportParams, ExportParams } from './export-params';
import { FuiDatagridOptionsWrapperService } from '../datagrid-options-wrapper.service';
import { DatagridUtils } from '../../utils/datagrid-utils';

export abstract class BaseCreator<T, S extends GridSerializingSession<T>, P extends ExportParams<T>> {
  protected constructor(
    protected downloader: Downloader,
    protected gridSerializer: GridSerializer<T>,
    protected gridOptionsWrapper: FuiDatagridOptionsWrapperService
  ) {}

  public export(userParams?: P): string {
    if (this.isExportSuppressed()) {
      console.warn(`fui-datagrid: Export cancelled. Export is not allowed as per your configuration.`);
      return '';
    }

    const { mergedParams, data } = this.getMergedParamsAndData(userParams);
    const fileNamePresent = mergedParams && mergedParams.fileName && mergedParams.fileName.length !== 0;
    let fileName = fileNamePresent ? mergedParams.fileName : this.getDefaultFileName();

    if (fileName!.indexOf('.') === -1) {
      fileName = fileName + '.' + this.getDefaultFileExtension();
    }

    this.downloader.download(fileName!, this.packageFile(data));

    return data;
  }

  public abstract createSerializingSession(params?: P): S;
  public abstract getMimeType(): string;
  public abstract getDefaultFileName(): string;
  public abstract getDefaultFileExtension(): string;
  public abstract isExportSuppressed(): boolean;

  protected packageFile(data: string): Blob {
    return new Blob(['\ufeff', data], {
      type: window.navigator.msSaveOrOpenBlob ? this.getMimeType() : 'octet/stream'
    });
  }

  private getMergedParamsAndData(userParams?: P): { mergedParams: P; data: string } {
    const mergedParams = this.mergeDefaultParams(userParams);
    const data = this.gridSerializer.serialize(this.createSerializingSession(mergedParams), mergedParams);

    return { mergedParams, data };
  }

  private mergeDefaultParams(userParams?: P): P {
    const baseParams: BaseExportParams | undefined = this.gridOptionsWrapper.getDefaultExportParams();
    const params: P = {} as any;
    DatagridUtils.assign(params, baseParams);
    DatagridUtils.assign(params, userParams);
    return params;
  }
}
