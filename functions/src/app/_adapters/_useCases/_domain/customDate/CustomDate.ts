export class CustomDate extends Date {
  private static pad(value: number) {
    return value < 10 ? '0' + value : value;
  }

  public addDays(daysToAdd: number): CustomDate {
    this.setDate(this.getDate() + daysToAdd);
    return this;
  }

  public toIsoString = (): string => {
    const utcIsoString = this.toISOString();
    return utcIsoString.slice(0, 19) + '+00:00';
  };

  public getFormattedTimezoneOffset = (): string => {
    const sign = this.getTimezoneOffset() > 0 ? '-' : '+';
    const offset = Math.abs(this.getTimezoneOffset());
    const hours = CustomDate.pad(Math.floor(offset / 60));
    const minutes = CustomDate.pad(offset % 60);
    return sign + hours + ':' + minutes;
  };
}
