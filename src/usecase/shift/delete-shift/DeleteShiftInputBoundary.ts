import { DeleteShiftInputData } from "./DeleteShiftInputData";

export interface DeleteShiftInputBoundary {
  deleteShift(input: DeleteShiftInputData): void;
}
