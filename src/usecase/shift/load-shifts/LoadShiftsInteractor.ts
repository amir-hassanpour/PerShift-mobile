import { LoadShiftsDAI } from "./LoadShiftsDAI";
import { LoadShiftsInputBoundary } from "./LoadShiftsInputBoundary";
import { LoadShiftsInputData } from "./LoadShiftsInputData";
import { LoadShiftsOutputBoundary } from "./LoadShiftsOutputBoundary";

export class LoadShiftsInteractor implements LoadShiftsInputBoundary {
  dao: LoadShiftsDAI;
  outputBoundary: LoadShiftsOutputBoundary;

  constructor(dao: LoadShiftsDAI, outputBoundary: LoadShiftsOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadShifts(input: LoadShiftsInputData): Promise<void> {
    try {
      const result = await this.dao.loadShifts(input);

      this.outputBoundary.prepareForSuccessView({ shifts: result.shifts });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Load Shifts failed error caught in the interactor",
      );
    }
  }
}
