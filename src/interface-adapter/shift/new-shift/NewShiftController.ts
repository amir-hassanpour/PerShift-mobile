import type { NewShiftInputData } from "@/usecase/shift/new-shift/NewShiftInputData";
import { NewShiftInteractor } from "@/usecase/shift/new-shift/NewShiftInteractor";

export class NewShiftController {
  interactor: NewShiftInteractor;

  constructor(interactor: NewShiftInteractor) {
    this.interactor = interactor;
  }

  async newShiftController({
    startTime,
    endTime,
    latitude,
    longitude,
    description,
    businessid,
    id,
  }: NewShiftInputData): Promise<void> {
    const inputData: NewShiftInputData = {
      startTime,
      endTime,
      latitude,
      longitude,
      description,
      businessid,
      id,
    };

    await this.interactor.addNewShift(inputData);
  }
}
