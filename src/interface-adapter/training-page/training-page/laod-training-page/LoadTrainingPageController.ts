import { LoadTrainingPageInteractor } from "@/usecase/trainings/training-page/load-training-page/LoadTrainingPageInteractor";

export class LoadTrainingPageController {
  interactor: LoadTrainingPageInteractor;

  constructor(interactor: LoadTrainingPageInteractor) {
    this.interactor = interactor;
  }

  async loadTrainingPage(trainingID: string) {
    await this.interactor.loadTrainingPage({ trainingID });
  }
}
