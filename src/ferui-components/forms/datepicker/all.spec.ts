import CalendarSpecs from './calendar.spec';
import DatepickerViewManagerSpecs from './datepicker-view-manager.spec';
import DayComponentSpecs from './day.spec';
import DaypickerSpecs from './daypicker.spec';
import CalendarViewModelSpecs from './model/calendar-view.model.spec';
import CalendarModelSpecs from './model/calendar.model.spec';
import DayModelSpecs from './model/day.model.spec';
import YearRangeModelSpecs from './model/year-range.model.spec';
import MonthpickerSpecs from './monthpicker.spec';
import DateFormControlServiceSpecs from '../common/providers/date-form-control.service.spec';
import DatepickerEnabledServiceSpecs from './providers/datepicker-enabled.service.spec';
import DatepickerFocusServiceSpecs from './providers/datepicker-focus.service.spec';
import LocaleHelperServiceSpecs from './providers/locale-helper.service.spec';
import ViewManagerServiceSpecs from './providers/view-manager.service.spec';
import YearpickerSpecs from './yearpicker.spec';
import { addHelpers } from '../tests/helpers.spec';

describe('Datepicker', function() {
  addHelpers();

  describe('Model', function() {
    DayModelSpecs();
    CalendarModelSpecs();
    YearRangeModelSpecs();
    CalendarViewModelSpecs();
  });

  describe('Providers', function() {
    ViewManagerServiceSpecs();
    LocaleHelperServiceSpecs();
    DatepickerFocusServiceSpecs();
    DatepickerEnabledServiceSpecs();
    DateFormControlServiceSpecs();
  });

  describe('Components', function() {
    DayComponentSpecs();
    DatepickerViewManagerSpecs();
    DaypickerSpecs();
    MonthpickerSpecs();
    YearpickerSpecs();
    CalendarSpecs();
  });
});
