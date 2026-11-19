import { LoadShiftsInteractor } from "@/usecase/shift/load-shifts/LoadShiftsInteractor";

export class LoadShiftsController {
  interactor: LoadShiftsInteractor;

  constructor(interactor: LoadShiftsInteractor) {
    this.interactor = interactor;
  }

  async loadShifts(input: { numShifts: number }) {
    await this.interactor.loadShifts(input);
  }
}
