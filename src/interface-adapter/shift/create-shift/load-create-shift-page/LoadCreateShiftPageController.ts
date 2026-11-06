import { LoadCreateShiftPageInteractor } from "@/usecase/shift/create-shift/load-create-shift-page/LoadCreateShiftPageInteractor";

export class LoadCreateShiftPageController {
  interactor: LoadCreateShiftPageInteractor;

  constructor(interactor: LoadCreateShiftPageInteractor) {
    this.interactor = interactor;
  }

  async loadCreateShiftPage(input: {}): Promise<void> {
    await this.interactor.loadCreateShiftPage({});
  }
}
