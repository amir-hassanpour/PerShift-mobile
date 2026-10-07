import { NewShiftInputData } from "./NewShiftInputData";

export interface NewShiftInputBoundary {
  addNewShift(inputData: NewShiftInputData): Promise<void>;
}
