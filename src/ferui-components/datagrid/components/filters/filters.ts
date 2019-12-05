import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Self } from '@angular/core';

@Component({
  selector: 'fui-datagrid-filters',
  template: `
    <div class="container-fluid">
      <div class="row">
        <div class="col-auto col-left">
          <fui-datagrid-search-filter-button *ngIf="!isLoading"></fui-datagrid-search-filter-button>
        </div>
        <div class="col col-right">
          <fui-datagrid-filter-column-visibility *ngIf="!isLoading"></fui-datagrid-filter-column-visibility>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-filters',
  },
})
export class FuiDatagridFilters implements OnInit {
  @Output() heightChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() isLoading: boolean = false;

  private _height: number = 0;

  constructor(@Self() public elementRef: ElementRef) {}

  get height(): number {
    return this._height;
  }

  /**
   * We set the height at ngOnInit stage. But if, for some reason, the height is 0, we then loop until the height is != 0.
   * @param value
   */
  set height(value: number) {
    this._height = value;
    if (this._height === 0) {
      setTimeout(() => {
        this.height = this.elementRef.nativeElement.offsetHeight;
        this.heightChange.emit(this._height);
      }, 10);
    }
  }

  ngOnInit(): void {
    this.height = this.elementRef.nativeElement.offsetHeight;
  }

  getElementHeight(): number {
    return this.height;
  }
}
