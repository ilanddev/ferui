import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IfOpenService } from '../utils/conditional/if-open.service';

import { POPOVER_HOST_ANCHOR } from '../popover/common/popover-host-anchor.token';
import { ROOT_DROPDOWN_PROVIDER, RootDropdownService } from './services/dropdown.service';

@Component({
  selector: 'fui-dropdown',
  template: '<ng-content></ng-content>',
  host: {
    '[class.fui-dropdown]': 'true',
    '[class.open]': 'ifOpenService.open',
  },
  providers: [IfOpenService, ROOT_DROPDOWN_PROVIDER, { provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuiDropdown implements OnDestroy {
  @Output() dropdownOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('fuiCloseMenuOnItemClick') isMenuClosable: boolean = true;

  @Input('forceClose')
  set forceClose(value: boolean) {
    if (value === true) {
      this.ifOpenService.open = false;
    }
  }

  private subscriptions: Subscription[] = [];

  constructor(
    @SkipSelf() @Optional() public parent: FuiDropdown,
    public ifOpenService: IfOpenService,
    private cdr: ChangeDetectorRef,
    private dropdownService: RootDropdownService
  ) {
    this.subscriptions.push(dropdownService.changes.subscribe(value => (this.ifOpenService.open = value)));
    this.subscriptions.push(
      ifOpenService.openChange.subscribe(value => {
        this.dropdownOpenChange.emit(value);
        this.cdr.markForCheck();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
