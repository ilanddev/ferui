import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum DatagridStateEnum {
  INITIALIZED = 'initialized',
  LOADED = 'loaded',
  INITIAL_LOADING = 'initial_loading',
  LOADING = 'loading',
  EMPTY = 'empty',
}

@Injectable()
export class DatagridStateService {
  private states$: Subject<DatagridStateEnum[]> = new Subject<DatagridStateEnum[]>();
  private states: DatagridStateEnum[] = [];

  getCurrentStates(): Observable<DatagridStateEnum[]> {
    return this.states$.asObservable();
  }

  hasState(state: DatagridStateEnum): boolean {
    return this.states.indexOf(state) >= 0;
  }

  setInitialized(): void {
    this.addState(DatagridStateEnum.INITIALIZED);
  }

  setInitialLoaded(): void {
    this.removeState(DatagridStateEnum.INITIAL_LOADING);
    this.addState(DatagridStateEnum.LOADED);
  }

  setLoaded(): void {
    this.removeState(DatagridStateEnum.LOADING);
    this.addState(DatagridStateEnum.LOADED);
  }

  setInitialLoading(): void {
    this.removeState(DatagridStateEnum.LOADED);
    this.addState(DatagridStateEnum.INITIAL_LOADING);
  }

  setLoading(): void {
    this.removeState(DatagridStateEnum.INITIAL_LOADING);
    this.removeState(DatagridStateEnum.LOADED);
    this.addState(DatagridStateEnum.LOADING);
  }

  setEmpty(): void {
    this.setLoaded();
    this.addState(DatagridStateEnum.EMPTY);
  }

  setNotEmpty(): void {
    this.removeState(DatagridStateEnum.EMPTY);
  }

  private addState(state: DatagridStateEnum): void {
    if (this.hasState(state)) {
      return;
    }
    this.states.push(state);
    this.states$.next(this.states);
  }

  private removeState(state: DatagridStateEnum): void {
    if (!this.hasState(state)) {
      return;
    }
    this.states.splice(this.getStateIndex(state), 1);
    this.states$.next(this.states);
  }

  private getStateIndex(state: DatagridStateEnum): number {
    return this.states.indexOf(state);
  }
}
