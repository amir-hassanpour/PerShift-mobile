import { Shift } from "@/entity/Shift";
import { User } from "@/entity/User";

export type CreateShiftInput = {
  userToAdd: User[];
  shift: Shift;
};

export type createShiftOutput = {
  shifts: Shift[];
};

export interface CreateShiftDAI {
  createShift(input: CreateShiftInput): Promise<createShiftOutput>;
}
