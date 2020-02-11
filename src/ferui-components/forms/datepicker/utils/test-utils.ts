export function createKeyboardEvent(code: number, type: string): KeyboardEvent {
  const event: KeyboardEvent = new KeyboardEvent(type);
  Object.defineProperties(event, { keyCode: { get: () => code } });
  return event;
}

export function assertEqualDates(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()
  );
}

export function assertEqualTimes(date1: Date, date2: Date): boolean {
  return (
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes() &&
    date1.getSeconds() === date2.getSeconds()
  );
}

export function assertEqualDatetimes(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate() &&
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes() &&
    date1.getSeconds() === date2.getSeconds()
  );
}
