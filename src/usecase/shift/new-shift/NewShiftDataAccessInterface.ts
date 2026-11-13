import { Shift } from "@/entity/Shift";

export type NewShiftInput = {
  startTime: Date;
  endTime: Date;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  businessid: string;
  id: string;
};

export type NewShiftOutput = {
  shifts: Shift[];
};

export interface NewShiftDataAccessInterface {
  newShift(inputData: NewShiftInput): Promise<NewShiftOutput>;
}
