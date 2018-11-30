import { Directive } from '@angular/core';
import { MarkControlService } from './providers/mark-control.service';

@Directive({
  selector: '[fuiForm]',
  providers: [MarkControlService],
  host: {
    '[class.fui-form]': 'true'
  },
})
export class FuiForm {
  constructor(private markControlService: MarkControlService) {}

  markAsDirty() {
    this.markControlService.markAsDirty();
  }
}
