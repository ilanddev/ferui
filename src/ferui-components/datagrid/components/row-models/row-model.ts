import { FuiRowModel } from '../../types/row-model.enum';
import { EventEmitter, Injectable } from '@angular/core';
import { FuiDatagridClientSideRowModel } from './client-side-row-model';
import { FuiDatagridServerSideRowModel } from './server-side-row-model';
import { FuiDatagridInfinteRowModel } from './infinite/infinite-row-model';
import { IServerSideDatasource, ServerSideRowModelInterface } from '../../types/server-side-row-model';
import { Subscription } from 'rxjs';

@Injectable()
export class RowModel {
  isReady: EventEmitter<boolean> = new EventEmitter<boolean>();

  // By default the row model is set to Client side.
  private _rowModel: FuiRowModel = FuiRowModel.CLIENT_SIDE;
  private subscriptions: Subscription[] = [];

  constructor(
    private clientSideRowModel: FuiDatagridClientSideRowModel,
    private serverSideRowModel: FuiDatagridServerSideRowModel,
    private infiniteRowModel: FuiDatagridInfinteRowModel
  ) {
    this.setupSubscribers();
  }

  set rowModel(rowModel: FuiRowModel) {
    this._rowModel = rowModel;
    this.setupSubscribers();
  }

  get rowModel(): FuiRowModel {
    return this._rowModel;
  }

  getRowModel(): FuiDatagridClientSideRowModel | FuiDatagridServerSideRowModel | FuiDatagridInfinteRowModel {
    switch (this.rowModel) {
      case FuiRowModel.CLIENT_SIDE:
        return this.clientSideRowModel;
      case FuiRowModel.INFINITE:
        return this.infiniteRowModel;
      case FuiRowModel.SERVER_SIDE:
        return this.serverSideRowModel;
      default:
        throw new Error(`There is no such ${this.rowModel} row model. Please use a valid row model.`);
    }
  }

  /**
   * Get the server-side row model from RowModel service.
   */
  getServerSideRowModel(): FuiDatagridServerSideRowModel | null {
    return this.isServerSideRowModel() ? (this.getRowModel() as FuiDatagridServerSideRowModel) : null;
  }

  /**
   * Get the infinite-server-side row model from RowModel service.
   */
  getInfiniteServerSideRowModel(): FuiDatagridInfinteRowModel | null {
    return this.isInfiniteServerSideRowModel() ? (this.getRowModel() as FuiDatagridInfinteRowModel) : null;
  }

  /**
   * Get the client-side row model from RowModel service.
   */
  getClientSideRowModel(): FuiDatagridClientSideRowModel | null {
    return this.isClientSideRowModel() ? (this.getRowModel() as FuiDatagridClientSideRowModel) : null;
  }

  isClientSideRowModel() {
    return this.rowModel === FuiRowModel.CLIENT_SIDE;
  }

  isServerSideRowModel() {
    // At initialisation, if the developer doesn't set any row model, by default it will be ClientSide.
    // But if he set a datasource, the default row model will be server side.
    return this.rowModel === FuiRowModel.SERVER_SIDE;
  }

  isInfiniteServerSideRowModel() {
    return this.rowModel === FuiRowModel.INFINITE;
  }

  refresh(limit?: number, datasource?: IServerSideDatasource) {
    if (this.rowModel !== FuiRowModel.CLIENT_SIDE) {
      (this.getRowModel() as ServerSideRowModelInterface).refresh(limit, datasource);
    }
  }

  /**
   * Get the datasource for either server-side row model or infinite-row-model.
   */
  getDatasource(): IServerSideDatasource | null {
    if (this.isInfiniteServerSideRowModel() || this.isServerSideRowModel()) {
      const rowModel: ServerSideRowModelInterface = this.getRowModel() as ServerSideRowModelInterface;
      return rowModel && rowModel.datasource ? rowModel.datasource : null;
    }
    return null;
  }

  destroy() {
    this.resetSubscribers();
    if (this.serverSideRowModel) {
      this.serverSideRowModel.reset();
    }
    if (this.infiniteRowModel) {
      this.infiniteRowModel.destroy();
    }
  }

  private resetSubscribers() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions = [];
    }
  }

  private setupSubscribers() {
    this.resetSubscribers();
    if (this.isServerSideRowModel()) {
      this.subscriptions.push(
        this.serverSideRowModel.isReady.subscribe(value => {
          this.isReady.emit(value);
        })
      );
    } else if (this.isInfiniteServerSideRowModel()) {
      this.subscriptions.push(
        this.infiniteRowModel.isReady.subscribe(value => {
          this.isReady.emit(value);
        })
      );
    }
  }
}
