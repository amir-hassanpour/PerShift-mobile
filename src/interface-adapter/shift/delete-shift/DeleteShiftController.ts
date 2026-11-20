import { DeleteShiftInteractor } from "@/usecase/shift/delete-shift/DeleteShiftInteractor";

export class DeleteShiftController {
  interactor: DeleteShiftInteractor;

  constructor(interactor: DeleteShiftInteractor) {
    this.interactor = interactor;
  }

  async deleteShift(input: { shiftID: string }) {
    await this.interactor.deleteShift(input);
  }
}
