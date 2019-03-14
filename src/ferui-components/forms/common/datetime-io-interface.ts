export interface DatetimeIoInterface {
  toLocaleDisplayFormatString(d: Date): string;
  getDateValueFromDateOrString(d: string | Date): Date;
}
