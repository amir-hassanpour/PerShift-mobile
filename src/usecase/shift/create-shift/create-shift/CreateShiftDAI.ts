import { Shift } from "@/entity/Shift";

export type CreateShiftInput = {
  shift: Shift;
};

export type createShiftOutput = {
  shifts: Shift[];
};

export interface CreateShiftDAI {
  createShift(input: CreateShiftInput): Promise<createShiftOutput>;
}
