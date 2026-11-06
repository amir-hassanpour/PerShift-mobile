import { CreateShiftInputData } from "./CreateShiftInputData";

export interface CreateShiftInputBoundary {
  createShift(input: CreateShiftInputData): void;
}
