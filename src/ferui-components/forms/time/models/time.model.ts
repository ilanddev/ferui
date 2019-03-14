export class TimeModel {
  constructor(
    public readonly hour: number,
    public readonly minute: number,
    public readonly second: number,
    public readonly originalDate?: Date
  ) {}

  /**
   * Checks if the passed TimeModel is equal to itself.
   */
  isEqual(day: TimeModel) {
    if (day) {
      return this.hour === day.hour && this.minute === day.minute && this.second === day.second;
    }
    return false;
  }

  /**
   * Converts the TimeModel into the Javascript Date object.
   */
  toDate(): Date {
    const date: Date = this.originalDate || new Date();
    date.setHours(this.hour);
    date.setMinutes(this.minute);
    date.setSeconds(this.second);
    return date;
  }
}
