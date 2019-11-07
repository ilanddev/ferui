import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';
import { RootDropdownService } from './services/dropdown.service';
import { FuiDropdown } from './dropdown';

@Directive({
  selector: '[fuiDropdownItem]',
  host: { '[class.fui-dropdown-item]': 'true' },
})
export class FuiDropdownItem implements AfterViewInit {
  constructor(
    private dropdown: FuiDropdown,
    private el: ElementRef,
    private _dropdownService: RootDropdownService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.renderer.listen(this.el.nativeElement, 'click', () => this.onDropdownItemClick());
  }

  onDropdownItemClick(): void {
    if (this.dropdown.isMenuClosable && !this.el.nativeElement.classList.contains('disabled')) {
      this._dropdownService.closeMenus();
    }
  }
}
