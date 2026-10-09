import { NewShiftDataAccessInterface } from "./NewShiftDataAccessInterface";
import { NewShiftInputBoundary } from "./NewShiftInputBoundary";
import { NewShiftInputData } from "./NewShiftInputData";
import { NewShiftOutputBoundary } from "./NewShiftOutputBoundary";
import { NewShiftOutputData } from "./NewShiftOutputData";

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

  async addNewShift(inputData: NewShiftInputData): Promise<void> {
    let result = await this.DAO.newShift(inputData);

    let outputData: NewShiftOutputData = {
      shifts: result.shifts,
    };

    await this.outputBoudnary.prepareForSuccessView(outputData);
  }
}
