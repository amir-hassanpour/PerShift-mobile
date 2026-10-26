import { LoadTrainingsPageInteractor } from "@/usecase/trainings/load-trainings/LoadTrainingsPageInteractor";

export class LoadTrainingsPageController {
  interactor: LoadTrainingsPageInteractor;

  constructor(interactor: LoadTrainingsPageInteractor) {
    this.interactor = interactor;
  }

  async loadTrainingsPage({}) {
    await this.interactor.loadTrainingsPage({});
  }
}
