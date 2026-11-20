import { DeleteShiftDAI } from "./DeleteShiftDAI";
import { DeleteShiftInputBoundary } from "./DeleteShiftInputBoundary";
import { DeleteShiftInputData } from "./DeleteShiftInputData";
import { DeleteShiftOutputBoundary } from "./DeleteShiftOutputBoundary";

export class DeleteShiftInteractor implements DeleteShiftInputBoundary {
  dao: DeleteShiftDAI;
  outputBoundary: DeleteShiftOutputBoundary;

  constructor(dao: DeleteShiftDAI, outputBoundary: DeleteShiftOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async deleteShift(input: DeleteShiftInputData): Promise<void> {
    try {
      const result = await this.dao.deleteShift(input);

      this.outputBoundary.prepareForSuccessView({
        shiftID: input.shiftID,
      });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Failed to delete shift interactor error",
      );
    }
  }
}
