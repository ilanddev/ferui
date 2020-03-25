import { IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { FuiDatagridEventService } from '../../../services/event.service';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../../events';
import { Observable, Subject } from 'rxjs';
import { DatagridStateEnum, DatagridStateService } from '../../../services/datagrid-state.service';

export interface RowNode {
  id: string;
  data: any;
}

export enum InfiniteBlockState {
  STATE_EMPTY = 'empty',
  STATE_LOADING = 'loading',
  STATE_LOADED = 'loaded',
  STATE_FAILED = 'failed'
}

export class InfiniteBlock {
  offset: number;
  limit: number;
  rowCount: number = 0;
  rowNodes: RowNode[] = [];
  error: any = null;

  private datasource: IServerSideDatasource;
  private params: IServerSideGetRowsParams;
  private blockNumber: number = 0;
  private state: InfiniteBlockState = InfiniteBlockState.STATE_EMPTY;
  private infiniteBlockSub: Subject<InfiniteBlock> = new Subject<InfiniteBlock>();

  constructor(private eventService: FuiDatagridEventService, private stateService: DatagridStateService) {}

  init(offset: number, limit: number, datasource: IServerSideDatasource, params: IServerSideGetRowsParams) {
    this.offset = offset;
    this.limit = limit;
    this.blockNumber = Math.floor(offset / limit);
    this.datasource = datasource;
    this.params = params;
    this.state = InfiniteBlockState.STATE_LOADING;
    this.loadFromDatasource().catch(error => {
      console.warn(error);
    });
  }

  infiniteBlockObservable(): Observable<InfiniteBlock> {
    return this.infiniteBlockSub.asObservable();
  }

  getState(): InfiniteBlockState {
    return this.state;
  }

  loadFromDatasource(): Promise<RowNode[]> {
    if (this.datasource) {
      return this.datasource.getRows
        .bind(this.datasource.context, this.params)()
        .then(resultObject => {
          if (resultObject.data.length === 0 && !resultObject.total) {
            this.state = InfiniteBlockState.STATE_EMPTY;
            this.rowCount = 0;
            this.setRowNodes([]);
            if (this.stateService) {
              this.stateService.setLoaded();
              this.stateService.setRefreshed();
            }
          } else {
            this.rowCount = resultObject.data.length;
            this.setRowNodes(resultObject.data);
            this.state = InfiniteBlockState.STATE_LOADED;
            // When at least the first block is loaded we remove the global loading.
            if (this.stateService) {
              this.stateService.setLoaded();
              this.stateService.setRefreshed();
            }
          }
          this.dispatchEvent(resultObject);
          this.infiniteBlockSub.next(this);
          return this.rowNodes;
        })
        .catch(error => {
          this.state = InfiniteBlockState.STATE_FAILED;
          if (this.stateService) {
            this.stateService.setLoaded();
            this.stateService.setRefreshed();
          }
          this.dispatchEvent(null);
          this.error = error;
          this.infiniteBlockSub.next(this);
          return error;
        });
    }
    return Promise.resolve([]);
  }

  private dispatchEvent(resultObject) {
    const event: ServerSideRowDataChanged = {
      type: FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED,
      resultObject: resultObject,
      api: null,
      columnApi: null,
      pageIndex: this.blockNumber
    };
    this.eventService.dispatchEvent(event);
  }

  private setRowNodes(data: any[]): void {
    if (data.length === 0) {
      this.rowNodes = [];
    } else {
      this.rowNodes = data.map((obj, idx) => {
        return {
          id: obj.id ? obj.id : idx === 0 ? this.offset : idx * this.offset,
          data: obj
        };
      });
    }
  }
}
