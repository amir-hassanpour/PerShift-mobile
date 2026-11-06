export class Shift {
  public readonly startTime: Date;
  public readonly endTime: Date;
  public readonly latitude: number | null;
  public readonly longitude: number | null;
  public readonly description: string | null;
  public readonly businessID: string;
  public readonly shiftID: string;

  constructor(
    startTime: Date,
    endTime: Date,
    latitude: number | null,
    longitude: number | null,
    businessID: string,
    shiftID: string,
    description: string | null,
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.businessID = businessID;
    this.shiftID = shiftID;
  }
}
