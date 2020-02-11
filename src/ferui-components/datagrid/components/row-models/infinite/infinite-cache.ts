import { InfiniteBlock, InfiniteBlockState, RowNode } from './infinite-block';
import { IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { Observable, Subject, Subscription } from 'rxjs';
import { FuiDatagridEventService } from '../../../services/event.service';
import { FuiDatagridEvents, ServerSideRowDataChanged } from '../../../events';

export class InfiniteCache {
  blocks: { [blockNumber: string]: InfiniteBlock } = {};
  maxReachedRowIndex: number = 0;
  reachedLastIndex: boolean = false;

  private params: IServerSideGetRowsParams;
  private blockCount = 0;
  private lastOffset: number = 0;
  private blocksLoadDebounce = null;
  private blockLoadDebounceMillis: number = 50; // ms
  private subscriptions: Subscription[] = [];
  private loadedBlocksSubscriptions: Subscription[] = [];
  private loadedBlocksSub: Subject<any[]> = new Subject<any[]>();
  private rows: any[] = [];
  private limit: number = 0;

  constructor(
    private infiniteMaxSurroundingBlocksInCache: number,
    private infiniteInitialBlocksCount: number,
    private eventService: FuiDatagridEventService
  ) {}

  init(limit: number, datasource: IServerSideDatasource, params: IServerSideGetRowsParams) {
    this.params = params;
    this.limit = limit;
    if (DatagridUtils.isObjectEmpty(this.blocks)) {
      this.loadBlocks(0, this.limit, datasource);

      this.subscriptions.push(
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED).subscribe(event => {
          const ev: ServerSideRowDataChanged = event as ServerSideRowDataChanged;
          const numberOfRows: number = ev.resultObject.data.length;
          if (numberOfRows > 0) {
            const lastOffset: number = ev.pageIndex * this.limit + (numberOfRows - 1);
            if (ev.resultObject.total && ev.resultObject.total > 0) {
              this.maxReachedRowIndex = ev.resultObject.total;
              this.reachedLastIndex = true;
            } else if (lastOffset > this.maxReachedRowIndex) {
              this.maxReachedRowIndex = lastOffset;
            }
          } else {
            this.reachedLastIndex = true;
          }
        })
      );
    }
  }

  /**
   * We always load N blocks before and after the current block
   * @param currentBlockIndex
   * @param limit
   * @param datasource
   * @param forceUpdate
   */
  loadBlocks(currentBlockIndex: number, limit: number, datasource: IServerSideDatasource, forceUpdate: boolean = false) {
    if (this.blocksLoadDebounce) {
      clearTimeout(this.blocksLoadDebounce);
    }
    this.blocksLoadDebounce = setTimeout(() => {
      const previousBlocks: number[] = [];
      const nextBlocks: number[] = [];
      this.limit = limit;
      for (let i = 1; i <= this.infiniteMaxSurroundingBlocksInCache; i++) {
        if (currentBlockIndex - i >= 0) {
          previousBlocks.push(currentBlockIndex - i);
        }
        nextBlocks.push(currentBlockIndex + i);
      }
      const blockIndexesToLoad: number[] = [...previousBlocks, currentBlockIndex, ...nextBlocks];

      // First we remove the not needed blocks
      for (const index in this.blocks) {
        if (this.blocks.hasOwnProperty(index) && blockIndexesToLoad.indexOf(Number(index)) === -1) {
          this.removeBlock(index);
        }
      }
      // Then we add the missing block
      for (const index of blockIndexesToLoad) {
        const offset = index * limit;
        this.addBlock(offset, limit, datasource, forceUpdate);
      }
    }, this.blockLoadDebounceMillis);
  }

  getRows(): Observable<any[]> {
    return this.loadedBlocksSub.asObservable();
  }

  hasLoadingBlock(): boolean {
    for (const blockKey in this.blocks) {
      if (this.blocks.hasOwnProperty(blockKey)) {
        const block: InfiniteBlock = this.blocks[blockKey];
        if (block.getState() === InfiniteBlockState.STATE_LOADING) {
          return true;
        }
      }
    }
    return false;
  }

  setParams(params: IServerSideGetRowsParams): void {
    this.params = params;
  }

  clear(): void {
    this.blocks = {};
    this.rows = [];
    this.blockCount = 0;
    this.lastOffset = 0;
    this.maxReachedRowIndex = 0;
    this.reachedLastIndex = false;

    if (this.loadedBlocksSubscriptions.length > 0) {
      this.loadedBlocksSubscriptions.forEach(sub => sub.unsubscribe());
      this.loadedBlocksSubscriptions = [];
    }
  }

  destroy(): void {
    this.clear();
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = null;
    }
  }

  private addBlock(offset: number, limit: number, datasource: IServerSideDatasource, forceUpdate: boolean = false) {
    const blockNumber: number = Math.floor(offset / limit);
    const blockNumberStr: string = blockNumber.toString();
    if (!this.blocks.hasOwnProperty(blockNumberStr) || forceUpdate) {
      const requestObj: IServerSideGetRowsParams = {
        request: {
          offset: offset,
          limit: limit
        }
      };
      const params: IServerSideGetRowsParams = DatagridUtils.mergeDeep<IServerSideGetRowsParams>({ ...this.params }, requestObj);
      const infiniteBlock: InfiniteBlock = new InfiniteBlock(this.eventService);
      infiniteBlock.init(offset, limit, datasource, params);

      this.loadedBlocksSubscriptions[blockNumber] = infiniteBlock.infiniteBlockObservable().subscribe(ib => {
        this.createDisplayedRowsArray(ib, this.rows);
      });
      this.blocks[blockNumberStr] = infiniteBlock;
      this.blockCount++;
    }
  }

  private removeBlock(blockNumber: string) {
    if (this.blocks.hasOwnProperty(blockNumber)) {
      this.createDisplayedRowsArray(this.blocks[blockNumber], this.rows, true);
      delete this.blocks[blockNumber];
      this.blockCount--;
      const blockNumberInt: number = parseInt(blockNumber, 10);
      if (this.loadedBlocksSubscriptions[blockNumberInt]) {
        this.loadedBlocksSubscriptions[blockNumberInt].unsubscribe();
        this.loadedBlocksSubscriptions.splice(blockNumberInt, 1);
      }
    }
  }

  private createDisplayedRowsArray(block: InfiniteBlock, rows: any[] = [], remove: boolean = false): void {
    if (rows.length === 0) {
      for (let i = 0; i < this.maxReachedRowIndex; i++) {
        rows.push({});
      }
    }

    const startIndex: number = block.offset;
    const rowNodes: RowNode[] = block.rowNodes;
    let rowCount = 0;
    for (const row of rowNodes) {
      const replace = remove ? {} : row.data;
      rows.splice(startIndex + rowCount, 1, replace);
      rowCount++;
    }
    this.rows = rows;
    this.loadedBlocksSub.next(rows);
  }
}
