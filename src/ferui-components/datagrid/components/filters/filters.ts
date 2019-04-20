import { Component, ElementRef, Input, OnInit, Self } from '@angular/core';

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
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'fui-datagrid-filters',
  },
})
export class FuiDatagridFilters implements OnInit {
  height: number;

  @Input() isLoading: boolean = false;

  constructor(@Self() public elementRef: ElementRef) {}

  ngOnInit(): void {
    this.height = this.elementRef.nativeElement.getBoundingClientRect().height;
  }
}
