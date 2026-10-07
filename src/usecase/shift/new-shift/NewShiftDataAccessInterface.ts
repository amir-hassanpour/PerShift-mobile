export type NewShiftInput = {
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  description?: string;
  businessid: string;
  id: string;
};

export type NewShiftOutput = {};

export interface NewShiftDataAccessInterface {
  newShift(inputData: NewShiftInput): Promise<NewShiftOutput>;
}
