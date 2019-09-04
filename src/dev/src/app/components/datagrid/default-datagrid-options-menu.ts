import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuiDatagrid, FuiRowModel, FuiDatagridApiService, FuiDatagridColumnApiService } from '@ferui/components';

@Component({
  selector: 'fui-demo-datagrid-option-menu',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col col-auto" *ngIf="isInfiniteOrServerSideRowModel()">
          <fui-select-container>
            <label>Bandwidth speed</label>
            <fui-select
              fuiSelect
              [name]="bandwidthSpeedName"
              [addTag]="true"
              [items]="bandwidthSpeedList"
              [clearable]="false"
              placeholder="Select a speed"
              (ngModelChange)="bandwidthSpeedChangeFn($event)"
              [(ngModel)]="bandwidthSpeed"
            >
              <ng-template ng-label-tmp let-item="item">{{ bandwidthSpeedLayout(item) }} </ng-template>
              <ng-template ng-option-tmp let-item="item" let-search="searchTerm">
                {{ bandwidthSpeedLayout(item || search) }}
              </ng-template>
              <ng-template ng-tag-tmp let-search="searchTerm"> {{ bandwidthSpeedLayout(search) }}</ng-template>
            </fui-select>
          </fui-select-container>
        </div>
        <div class="col pt-2">
          <button class="btn btn-info" (click)="sizeColumnsToFit()">Size columns to fit the grid</button>
          <button class="btn btn-info ml-2" (click)="autoWidthColumns()">Auto width all columns</button>
          <button class="btn btn-secondary ml-2" (click)="refreshGrid()">Refresh grid</button>
          <button class="btn btn-secondary ml-2" (click)="resetGrid()">Reset grid</button>
        </div>
      </div>
    </div>
  `,
})
export class DefaultDatagridOptionsMenu {
  @Output() bandwidthSpeedChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() bandwidthSpeedName: string = this.generateUniqueName('bandwidthSpeed');
  @Input() bandwidthSpeed: number = 260;
  @Input() datagridRowModel: FuiRowModel;

  @Input() set datagrid(datagrid: FuiDatagrid) {
    this._datagrid = datagrid;
    // We set the grid api and column api
    this.gridApi = datagrid.getGridApi();
    this.columnApi = datagrid.getColumnApi();
  }

  get datagrid(): FuiDatagrid {
    return this._datagrid;
  }

  gridApi: FuiDatagridApiService;
  columnApi: FuiDatagridColumnApiService;
  bandwidthSpeedList: number[] = [120, 260, 500];

  private _datagrid: FuiDatagrid;

  constructor() {}

  bandwidthSpeedChangeFn(event) {
    this.bandwidthSpeedChange.emit(event);
  }

  bandwidthSpeedLayout(value: number): string {
    switch (value) {
      case 120:
        return `Fast network (~${value}ms per request)`;
      case 260:
        return `Average network (~${value}ms per request)`;
      case 500:
        return `Slow network (~${value}ms per request)`;
      default:
        return `Custom : ~${value}ms per request`;
    }
  }

  sizeColumnsToFit() {
    this.gridApi.sizeColumnsToFit();
  }

  autoWidthColumns() {
    this.columnApi.autoSizeAllColumns();
  }

  isInfiniteOrServerSideRowModel() {
    return this.datagridRowModel === FuiRowModel.SERVER_SIDE || this.datagridRowModel === FuiRowModel.INFINITE;
  }

  refreshGrid() {
    this.datagrid.refreshGrid(false);
  }

  resetGrid() {
    this.datagrid.refreshGrid(true, true);
  }

  private generateUniqueName(type: string = 'datagrid'): string {
    const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return type + randLetter + Date.now();
  }
}
