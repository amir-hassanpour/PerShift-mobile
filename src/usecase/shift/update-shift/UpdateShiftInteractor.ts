import { Shift } from "@/entity/Shift";
import { UpdateShiftDAI } from "./UpdateShiftDAI";
import { UpdateShiftInputBoundary } from "./UpdateShiftInputBoundary";
import { UpdateShiftInputData } from "./UpdateShiftInputData";
import { UpdateShiftOutputBoundary } from "./UpdateShiftOutputBoundary";

export class UpdateShiftInteractor implements UpdateShiftInputBoundary {
  dao: UpdateShiftDAI;
  outputBoundary: UpdateShiftOutputBoundary;

  constructor(dao: UpdateShiftDAI, outputBoundary: UpdateShiftOutputBoundary) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async updateShift(input: UpdateShiftInputData): Promise<void> {
    try {
      const updatedShift = new Shift(
        input.startTime,
        input.endTime,
        input.latitude,
        input.longitude,
        input.businessID,
        input.shiftID,
        input.description,
      );
      const result = await this.dao.updateShift({
        shift: updatedShift,
      });

      this.outputBoundary.prepareForSuccessView({ updatedShift });
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "Fail to update shift interactor error",
      );
      throw error;
    }
  }
}
