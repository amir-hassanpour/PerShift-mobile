import { Shift } from "@/entity/Shift";

export type UpdateShiftInput = {
  shift: Shift;
};

export type UpdateShiftOutput = {};

export interface UpdateShiftDAI {
  updateShift(input: UpdateShiftInput): Promise<UpdateShiftOutput>;
}
