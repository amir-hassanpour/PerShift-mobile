import { Shift } from "@/entity/Shift";

export type LoadShiftsInput = {
  numShifts: number;
};

export type LoadShiftsOutput = {
  shifts: Shift[];
};

export interface LoadShiftsDAI {
  loadShifts(input: LoadShiftsInput): Promise<LoadShiftsOutput>;
}
