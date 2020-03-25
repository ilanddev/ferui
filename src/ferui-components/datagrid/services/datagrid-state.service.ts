import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DatagridUtils } from '../utils/datagrid-utils';

export enum DatagridStateEnum {
  INITIALIZED = 'initialized',
  LOADED = 'loaded',
  LOADED_MORE = 'loaded_more',
  LOADING = 'loading',
  LOADING_MORE = 'loading_more',
  EMPTY = 'empty',
  REFRESHING = 'refreshing'
}

export enum DatagridStateComparison {
  AND,
  OR
}

@Injectable()
export class DatagridStateService {
  private states$: Subject<DatagridStateEnum[]> = new Subject<DatagridStateEnum[]>();
  private states: DatagridStateEnum[] = [];
  private previousStates: DatagridStateEnum[] = [];

  getCurrentStates(): Observable<DatagridStateEnum[]> {
    return this.states$.asObservable();
  }

  setInitialized(): void {
    this.addState(DatagridStateEnum.INITIALIZED);
    this.emitChange();
  }

  setLoaded(): void {
    this.replaceOrAddState(DatagridStateEnum.LOADING, DatagridStateEnum.LOADED);
  }

  setLoading(): void {
    this.replaceOrAddState(DatagridStateEnum.LOADED, DatagridStateEnum.LOADING);
  }

  setLoadedMore(): void {
    this.replaceOrAddState(DatagridStateEnum.LOADING_MORE, DatagridStateEnum.LOADED_MORE);
  }

  setLoadingMore(): void {
    this.replaceOrAddState(DatagridStateEnum.LOADED_MORE, DatagridStateEnum.LOADING_MORE);
  }

  setRefreshing(): void {
    this.addState(DatagridStateEnum.REFRESHING);
    this.emitChange();
  }

  setRefreshed(): void {
    this.removeState(DatagridStateEnum.REFRESHING);
    this.emitChange();
  }

  setEmpty(): void {
    this.addState(DatagridStateEnum.EMPTY);
    this.emitChange();
  }

  setNotEmpty(): void {
    this.removeState(DatagridStateEnum.EMPTY);
    this.emitChange();
  }

  hasState(state: DatagridStateEnum): boolean {
    return this.states.indexOf(state) >= 0;
  }

  hasStates(states: DatagridStateEnum[], comparison: DatagridStateComparison = DatagridStateComparison.AND): boolean {
    for (const state of states) {
      if (comparison === DatagridStateComparison.AND) {
        if (!this.hasState(state)) {
          return false;
        }
      } else if (comparison === DatagridStateComparison.OR) {
        if (this.hasState(state)) {
          return true;
        }
      }
    }
    return comparison === DatagridStateComparison.AND;
  }

  private replaceOrAddState(state: DatagridStateEnum, replace: DatagridStateEnum): void {
    if (!this.hasState(state)) {
      this.addState(replace);
      this.emitChange();
      return;
    }
    if (this.hasState(replace)) {
      this.removeState(state);
      this.emitChange();
      return;
    }
    this.states.splice(this.getStateIndex(state), 1, replace);
    this.emitChange();
  }

  private addState(state: DatagridStateEnum): void {
    if (this.hasState(state)) {
      return;
    }
    this.states.push(state);
  }

  private removeState(state: DatagridStateEnum): void {
    if (!this.hasState(state)) {
      return;
    }
    this.states.splice(this.getStateIndex(state), 1);
  }

  private emitChange(): void {
    if (!DatagridUtils.isEqual(this.previousStates, this.states)) {
      this.previousStates = [...this.states];
      this.states$.next(this.states);
    }
  }

  private getStateIndex(state: DatagridStateEnum): number {
    return this.states.indexOf(state);
  }
}
