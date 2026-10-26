import { Training } from "@/entity/Training";
import { NewTrainingInteractor } from "@/usecase/trainings/new-training/NewTrainingInteractor";

export class NewTrainingController {
  interactor: NewTrainingInteractor;

  constructor(interactor: NewTrainingInteractor) {
    this.interactor = interactor;
  }

  async newTraining(inputData: { training: Training }): Promise<void> {
    await this.interactor.newTraining(inputData);
  }
}
