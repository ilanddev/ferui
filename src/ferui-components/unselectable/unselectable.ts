import { Directive, ElementRef, Input, OnInit, Renderer2, Self } from '@angular/core';

@Directive({
  selector: '[unselectable]',
})
export class FuiUnselectable implements OnInit {
  // It can be 'on' or 'off' and if nothing set, it's considered as 'on'.
  @Input('unselectable') unselectable: string = 'on';

  constructor(@Self() private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (this.unselectable.toLowerCase() === 'off') {
      this.renderer.removeClass(this.elementRef.nativeElement, 'fui-unselectable');
      this.renderer.addClass(this.elementRef.nativeElement, 'fui-selectable');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'fui-selectable');
      this.renderer.addClass(this.elementRef.nativeElement, 'fui-unselectable');
    }
  }
}
