import { FuiFormLayoutEnum } from '../../forms/common/layout.enum';

export interface DynamicWrapper {
  _dynamic: boolean;
  controlLayout(): FuiFormLayoutEnum;
}
