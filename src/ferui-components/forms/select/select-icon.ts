import { Directive, ElementRef, EventEmitter, HostListener, Output, Self } from '@angular/core';

@Directive({
  selector: '[fuiSelectIcon]',
  host: {
    '[class.focused]': 'focused',
  },
})
export class FuiSelectIcon {
  @Output() onClick: EventEmitter<boolean> = new EventEmitter();

  private _focused: boolean = false;
  private _clicked: boolean = false;

  constructor(@Self() public elementRef: ElementRef) {}

  get focused(): boolean {
    return this._focused;
  }

  set focused(value: boolean) {
    this._focused = value;
  }

  get clicked(): boolean {
    return this._clicked;
  }

  set clicked(value: boolean) {
    this._clicked = value;
  }

  @HostListener('mousedown')
  clickHandler() {
    this.clicked = !this.clicked;
    this.onClick.emit(this.clicked);
  }
}
