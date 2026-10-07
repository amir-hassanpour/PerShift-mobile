import { NewShiftDataAccessInterface } from "./NewShiftDataAccessInterface";
import { NewShiftInputBoundary } from "./NewShiftInputBoundary";
import { NewShiftInputData } from "./NewShiftInputData";
import { NewShiftOutputBoundary } from "./NewShiftOutputBoundary";

export class NewShiftInteractor implements NewShiftInputBoundary {
  outputBoudnary: NewShiftOutputBoundary;
  DAO: NewShiftDataAccessInterface;

  constructor(
    outputBoudnary: NewShiftOutputBoundary,
    DAO: NewShiftDataAccessInterface,
  ) {
    this.DAO = DAO;
    this.outputBoudnary = outputBoudnary;
  }

  addNewShift(inputData: NewShiftInputData): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
