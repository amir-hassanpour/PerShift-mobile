import { LoadTrainingPageDataAccessInterface } from "./LoadTrainingPageDataAccessInterface";
import { LoadTrainingPageInputBoundary } from "./LoadTrainingPageInputBoundary";
import { LoadTrainingPageInputData } from "./LoadTrainingPageInputData";
import { LoadTrainingPageOutputBoundary } from "./LoadTrainingPageOutputBoundary";

export class LoadTrainingPageInteractor implements LoadTrainingPageInputBoundary {
  dao: LoadTrainingPageDataAccessInterface;
  outputBoundary: LoadTrainingPageOutputBoundary;

  constructor(
    dao: LoadTrainingPageDataAccessInterface,
    outputBoundary: LoadTrainingPageOutputBoundary,
  ) {
    this.dao = dao;
    this.outputBoundary = outputBoundary;
  }

  async loadTrainingPage(inputData: LoadTrainingPageInputData): Promise<void> {
    try {
      const result = await this.dao.loadTrainingPage(inputData);

      this.outputBoundary.prepareForSuccessView(result);
    } catch (error) {
      this.outputBoundary.prepareForFailureView(
        "couldn't load the training page interactor",
      );
    }
  }
}
