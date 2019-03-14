import { DayModel } from './day.model';

export class DayViewModel {
  constructor(
    public dayModel: DayModel,
    public isTodaysDate: boolean = false,
    public isDisabled: boolean = false,
    public isSelected: boolean = false,
    public isFocusable: boolean = false
  ) {}

  /**
   * Gets the tab index based on the isFocusable flag.
   */
  get tabIndex(): number {
    return this.isFocusable ? 0 : -1;
  }
}
