import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'fui-demo-datagrid-option-menu',
  template: `
    <fui-select-container>
      <label>Bandwidth speed</label>
      <ng-select
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
      </ng-select>
    </fui-select-container>
  `,
})
export class DefaultDatagridOptionsMenu {
  @Output() bandwidthSpeedChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() bandwidthSpeedName: string = this.generateUniqueName('bandwidthSpeed');
  @Input() bandwidthSpeed: number = 260;

  bandwidthSpeedList: number[] = [120, 260, 500];

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

  private generateUniqueName(type: string = 'datagrid'): string {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return type + randLetter + Date.now();
  }
}
