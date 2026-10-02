export class Business {
  public readonly id: string;
  public readonly name: string;
  public readonly lastCheckedIn: Date;

  constructor(id: string, name: string, lastCheckedIn: Date) {
    this.id = id;
    this.name = name;
    this.lastCheckedIn = lastCheckedIn;
  }
}
