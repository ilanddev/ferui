import { InfiniteBlock, InfiniteBlockState, RowNode } from './infinite-block';
import { IServerSideDatasource, IServerSideGetRowsParams } from '../../../types/server-side-row-model';
import { DatagridUtils } from '../../../utils/datagrid-utils';
import { Subscription } from 'rxjs';
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
  private blockLoadDebounceMillis: number = 150; // ms
  private subscriptions: Subscription[] = [];

  constructor(
    private infiniteMaxSurroundingBlocksInCache: number,
    private infiniteInitialBlocksCount: number,
    private eventService: FuiDatagridEventService
  ) {}

  init(limit: number, datasource: IServerSideDatasource, params: IServerSideGetRowsParams) {
    this.params = params;
    if (DatagridUtils.isObjectEmpty(this.blocks)) {
      this.loadBlocks(0, limit, datasource);

      this.subscriptions.push(
        this.eventService.listenToEvent(FuiDatagridEvents.EVENT_SERVER_ROW_DATA_CHANGED).subscribe(event => {
          const ev: ServerSideRowDataChanged = event as ServerSideRowDataChanged;
          const numberOfRows: number = ev.resultObject.data.length;
          if (numberOfRows > 0) {
            const lastOffset: number = ev.pageIndex * limit + (numberOfRows - 1);
            if (lastOffset > this.maxReachedRowIndex) {
              this.maxReachedRowIndex = lastOffset;
            }
          } else {
            this.reachedLastIndex = true;
          }
        })
      );
    }
  }

  addBlock(offset: number, limit: number, datasource: IServerSideDatasource) {
    const blockNumber = Math.floor(offset / limit);
    if (!this.blocks.hasOwnProperty(blockNumber.toString())) {
      const requestObj: IServerSideGetRowsParams = {
        request: {
          offset: offset,
          limit: limit,
        },
      };
      const params: IServerSideGetRowsParams = { ...this.params, ...requestObj };
      const infiniteBlock: InfiniteBlock = new InfiniteBlock(this.eventService);
      infiniteBlock.init(offset, limit, datasource, params);
      this.blocks[blockNumber.toString()] = infiniteBlock;
      this.blockCount++;
    }
  }

  removeBlock(blockNumber: string) {
    if (this.blocks.hasOwnProperty(blockNumber)) {
      delete this.blocks[blockNumber];
      this.blockCount--;
    }
  }

  /**
   * We always load N blocks before and after the current block
   * @param currentBlockIndex
   * @param limit
   * @param datasource
   */
  loadBlocks(currentBlockIndex: number, limit: number, datasource: IServerSideDatasource) {
    if (this.blocksLoadDebounce) {
      clearTimeout(this.blocksLoadDebounce);
    }
    this.blocksLoadDebounce = setTimeout(() => {
      const previousBlocks: number[] = [];
      const nextBlocks: number[] = [];
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
        this.addBlock(offset, limit, datasource);
      }
    }, this.blockLoadDebounceMillis);
  }

  getRows(): any[] {
    const rows: any[] = [];

    for (let i = 0; i < this.maxReachedRowIndex; i++) {
      rows.push({});
    }
    for (const index in this.blocks) {
      if (this.blocks.hasOwnProperty(index)) {
        const block: InfiniteBlock = this.blocks[index];
        if (block.getState() !== InfiniteBlockState.STATE_LOADED) {
          continue;
        }

        const startIndex: number = block.offset;
        const rowNodes: RowNode[] = block.rowNodes;
        let rowCount = 0;
        for (const row of rowNodes) {
          rows.splice(startIndex + rowCount, 1, row.data);
          rowCount++;
        }
      }
    }

    return rows;
  }

  setParams(params: IServerSideGetRowsParams) {
    this.params = params;
  }

  clear() {
    this.blocks = {};
    this.blockCount = 0;
    this.lastOffset = 0;
    this.maxReachedRowIndex = 0;
  }

  destroy() {
    this.clear();
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = null;
  }
}
