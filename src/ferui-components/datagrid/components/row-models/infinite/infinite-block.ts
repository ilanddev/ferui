import { IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { FuiDatagridEventService } from '../../../services/event.service';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../../events';

export interface RowNode {
  id: string;
  data: any;
}

export enum InfiniteBlockState {
  STATE_EMPTY = 'empty',
  STATE_LOADING = 'loading',
  STATE_LOADED = 'loaded',
  STATE_FAILED = 'failed',
}

export class InfiniteBlock {
  offset: number;
  limit: number;
  rowCount: number = 0;
  rowNodes: RowNode[] = [];

  private datasource: IServerSideDatasource;
  private params: IServerSideGetRowsParams;
  private blockNumber: number = 0;
  private state: InfiniteBlockState = InfiniteBlockState.STATE_EMPTY;

  constructor(private eventService: FuiDatagridEventService) {}

  init(offset: number, limit: number, datasource: IServerSideDatasource, params: IServerSideGetRowsParams) {
    this.offset = offset;
    this.limit = limit;
    this.blockNumber = this.offset / this.limit;
    this.datasource = datasource;
    this.params = params;
    this.loadFromDatasource().catch(error => {
      throw error;
    });
  }

  getState(): InfiniteBlockState {
    return this.state;
  }

  async loadFromDatasource(): Promise<RowNode[]> {
    if (this.datasource) {
      this.state = InfiniteBlockState.STATE_LOADING;
      return this.datasource.getRows
        .bind(this.datasource.context, this.params)()
        .then(resultObject => {
          if (resultObject.data.length === 0 && !resultObject.total) {
            this.state = InfiniteBlockState.STATE_EMPTY;
            this.rowCount = 0;
            this.setRowNodes([]);
          } else {
            this.rowCount = resultObject.data.length;
            this.state = InfiniteBlockState.STATE_LOADED;
            this.setRowNodes(resultObject.data);
          }
          const event: ServerSideRowDataChanged = {
            type: FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED,
            resultObject: resultObject,
            api: null,
            columnApi: null,
            pageIndex: this.blockNumber,
          };
          this.eventService.dispatchEvent(event);
          return this.rowNodes;
        })
        .catch(error => {
          this.state = InfiniteBlockState.STATE_FAILED;
          return error;
        });
    }
  }

  private setRowNodes(data: any[]): void {
    if (data.length === 0) {
      this.rowNodes = [];
    } else {
      this.rowNodes = data.map((obj, idx) => {
        return {
          id: obj.id ? obj.id : idx === 0 ? this.offset : idx * this.offset,
          data: obj,
        };
      });
    }
  }
}
