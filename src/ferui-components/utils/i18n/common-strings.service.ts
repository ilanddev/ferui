import { SkipSelf, Optional, InjectableProvider, forwardRef, Injectable } from '@angular/core';
import { AbstractFuiCommonStrings } from './common-strings.interface';

export class FuiCommonStringsService implements Required<FuiCommonStrings> {
  open = 'Open';
  close = 'Close';
  show = 'Show';
  hide = 'Hide';
  expand = 'Expand';
  collapse = 'Collapse';
  more = 'More';
  select = 'Select';
  selectAll = 'Select All';
  previous = 'Previous';
  next = 'Next';
  current = 'Jump to current';
  info = 'Info';
  success = 'Success';
  warning = 'Warning';
  danger = 'Error';
  rowActions = 'Available actions';
  pickColumns = 'Show or hide columns';
  seconds = 'Seconds';
  minutes = 'Minutes';
  hours = 'Hours';
}

export function commonStringsFactory(existing?: FuiCommonStrings): FuiCommonStrings {
  const defaults = new FuiCommonStringsService();
  if (existing) {
    return { ...defaults, ...existing };
  }
  return defaults;
}

@Injectable({
  providedIn: 'root',
  useFactory: commonStringsFactory,
})
export class FuiCommonStrings extends AbstractFuiCommonStrings {}
